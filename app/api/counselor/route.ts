import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const COUNSELOR_SYSTEM_PROMPTS = {
  en: `You are a professional, licensed counselor with expertise in mental health and emotional well-being. Your role is to provide compassionate, unbiased, and professional support to individuals seeking guidance.

Key principles you follow:
1. **Professionalism**: Maintain a warm but professional tone, using evidence-based approaches
2. **Unbiased Support**: Provide neutral, non-judgmental responses regardless of background, beliefs, or circumstances
3. **Compassionate Listening**: Show empathy and understanding while maintaining professional boundaries
4. **Safety First**: If someone mentions self-harm, suicidal thoughts, or crisis situations, immediately provide crisis resources and encourage professional help
5. **Limitations**: Be clear about your role as an AI counselor and encourage professional help when appropriate
6. **Active Listening**: Reflect back what you hear and ask clarifying questions when needed
7. **Practical Guidance**: Offer practical coping strategies and techniques when appropriate

Your responses should be:
- Warm and empathetic but professional
- 3-5 sentences in length (provide complete, helpful responses)
- Focused on the person's emotional well-being
- Free from judgment or bias
- Encouraging of professional help when needed
- Complete and well-formed (never cut off mid-sentence)

IMPORTANT: Always provide complete, finished responses. Never leave sentences or thoughts incomplete.

Remember: You are an AI counselor providing general support, not a replacement for professional mental health care.`,

  zh: `您是一位专业的、持证的心理咨询师，在心理健康和情感福祉方面具有专业知识。您的职责是为寻求指导的个人提供富有同情心、无偏见和专业的支持。

您遵循的关键原则：
1. **专业性**：保持温暖但专业的语调，使用循证方法，不要描述自己的动作
2. **无偏见支持**：无论背景、信仰或情况如何，都提供中立、非评判性的回应
3. **富有同情心的倾听**：在保持专业界限的同时表现出同理心和理解
4. **安全第一**：如果有人提到自残、自杀念头或危机情况，立即提供危机资源并鼓励专业帮助
5. **局限性**：明确您作为AI咨询师的角色，并在适当时鼓励专业帮助
6. **积极倾听**：反映您听到的内容，并在需要时提出澄清性问题
7. **实用指导**：在适当时提供实用的应对策略和技巧

您的回应应该是：
- 温暖且富有同理心但专业
- 3-5句话长度（提供完整、有用的回应）
- 专注于个人的情感福祉
- 无判断或偏见
- 在需要时鼓励专业帮助
- 完整且结构良好（永远不要中途切断句子）

重要提示：始终提供完整、完成的回应。永远不要留下不完整的句子或想法。

记住：您是一位提供一般性支持的AI咨询师，不是专业心理健康护理的替代品。`
}

export async function POST(request: NextRequest) {
  let language = 'en' // Default language
  
  // Check if API key is configured
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY is not configured')
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    )
  }
  
  try {
    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { message, conversationHistory, language: requestLanguage = 'en' } = requestBody
    language = requestLanguage // Set the language from request

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check for crisis keywords in both languages
    const crisisKeywords = {
      en: [
        'suicide', 'kill myself', 'want to die', 'end it all', 'self-harm',
        'cut myself', 'overdose', 'no reason to live', 'better off dead'
      ],
      zh: [
        '自杀', '想死', '结束生命', '自残', '割腕', '服药过量', 
        '没有活下去的理由', '死了更好', '不想活了', '结束一切'
      ]
    }
    
    const currentKeywords = crisisKeywords[language as keyof typeof crisisKeywords] || crisisKeywords.en
    const hasCrisisContent = currentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    if (hasCrisisContent) {
      const crisisResponse = language === 'zh' 
        ? `我对您分享的内容非常担心。如果您有自残或自杀的想法，请知道现在就有帮助。请拨打全国自杀预防热线988或发送HOME到741741联系危机短信热线。这些服务是免费、保密的，全天24小时可用。您不必独自面对这些 - 有人想要帮助您。`
        : `I'm very concerned about what you're sharing. If you're having thoughts of self-harm or suicide, please know that help is available right now. Please call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 to reach the Crisis Text Line. These services are free, confidential, and available 24/7. You don't have to go through this alone - there are people who want to help you.`
      
      return NextResponse.json({
        response: crisisResponse
      })
    }

    const systemPrompt = COUNSELOR_SYSTEM_PROMPTS[language as keyof typeof COUNSELOR_SYSTEM_PROMPTS] || COUNSELOR_SYSTEM_PROMPTS.en

    // Ensure conversationHistory is an array
    const safeConversationHistory = Array.isArray(conversationHistory) ? conversationHistory : []
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...safeConversationHistory,
      { role: 'user', content: message }
    ]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased to 15 second timeout

    // Retry mechanism for truncated responses
    let retryCount = 0
    const maxRetries = 1

    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-reasoner',
            messages: messages,
            max_tokens: retryCount === 0 ? 500 : 800, // Increase tokens on retry
            temperature: 0.7,
            top_p: 0.9,
            stream: false // Ensure we get complete responses
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('DeepSeek API error details:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          })
          throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        
        // Check if response was completed or truncated
        const finishReason = data.choices[0]?.finish_reason
        const usage = data.usage // Log token usage for monitoring
        
        console.log('DeepSeek API response details:', {
          finishReason,
          promptTokens: usage?.prompt_tokens,
          completionTokens: usage?.completion_tokens,
          totalTokens: usage?.total_tokens,
          maxTokens: retryCount === 0 ? 500 : 800
        })
        
        if (finishReason === 'length' && retryCount < maxRetries) {
          console.warn('DeepSeek response was truncated, retrying with higher token limit')
          retryCount++
          continue // Retry with higher token limit
        }
        
        const counselorResponse = data.choices[0]?.message?.content

        if (!counselorResponse) {
          throw new Error('No response from DeepSeek API')
        }

        // Check if response seems incomplete (ends abruptly)
        const trimmedResponse = counselorResponse.trim()
        if (trimmedResponse.length < 10) {
          throw new Error('Response too short - likely incomplete')
        }

        // Check for common incomplete response patterns - only for obvious cases
        const lastChar = trimmedResponse.slice(-1)
        
        // Only flag as incomplete if it ends with obvious incomplete patterns
        if (trimmedResponse.endsWith('...') || 
            trimmedResponse.endsWith('..') || 
            trimmedResponse.endsWith('…')) {
          throw new Error('Response appears to be incomplete - ends with ellipsis')
        }

        // Additional checks for Chinese responses - only for obvious incomplete patterns
        if (language === 'zh') {
          const chineseLastChar = trimmedResponse.slice(-1)
          
          // Only flag Chinese responses as incomplete if they end with ellipsis
          if (trimmedResponse.endsWith('...') || 
              trimmedResponse.endsWith('..') || 
              trimmedResponse.endsWith('…')) {
            throw new Error('Chinese response appears to be incomplete - ends with ellipsis')
          }
        }

        // If we get here, we have a valid response
        return NextResponse.json({
          response: counselorResponse
        })
        
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout - DeepSeek API took too long to respond')
        }
        
        // If this is the last retry, throw the error
        if (retryCount >= maxRetries) {
          throw fetchError
        }
        
        // Otherwise, retry
        retryCount++
        console.warn(`Retrying DeepSeek API call (attempt ${retryCount}/${maxRetries + 1})`)
      }
    }

  } catch (error) {
    console.error('Counselor API error:', error)
    
    // Provide more specific error messages based on the error type
    let errorResponse: string
    
    if (error.message.includes('truncated') || error.message.includes('incomplete')) {
      errorResponse = language === 'zh'
        ? "抱歉，我的回应似乎不完整。请重新发送您的消息，我会尽力提供完整的回应。"
        : "I'm sorry, my response seems incomplete. Please send your message again, and I'll do my best to provide a complete response."
    } else if (error.message.includes('timeout')) {
      errorResponse = language === 'zh'
        ? "抱歉，响应时间过长。请稍后再试，或考虑联系人类咨询师获得即时支持。"
        : "I'm sorry, the response is taking too long. Please try again in a moment, or consider reaching out to a human counselor for immediate support."
    } else {
      errorResponse = language === 'zh'
        ? "抱歉，我现在连接有问题。请稍后再试，或考虑联系人类咨询师或心理健康专业人士获得即时支持。"
        : "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or consider reaching out to a human counselor or mental health professional for immediate support."
    }
    
    return NextResponse.json(
      { response: errorResponse },
      { status: 500 }
    )
  }
} 