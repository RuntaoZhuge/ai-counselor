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
- 2-4 sentences in length (concise but helpful)
- Focused on the person's emotional well-being
- Free from judgment or bias
- Encouraging of professional help when needed

Remember: You are an AI counselor providing general support, not a replacement for professional mental health care.`,

  zh: `您是一位专业的、持证的心理咨询师，在心理健康和情感福祉方面具有专业知识。您的职责是为寻求指导的个人提供富有同情心、无偏见和专业的支持。

您遵循的关键原则：
1. **专业性**：保持温暖但专业的语调，使用循证方法
2. **无偏见支持**：无论背景、信仰或情况如何，都提供中立、非评判性的回应
3. **富有同情心的倾听**：在保持专业界限的同时表现出同理心和理解
4. **安全第一**：如果有人提到自残、自杀念头或危机情况，立即提供危机资源并鼓励专业帮助
5. **局限性**：明确您作为AI咨询师的角色，并在适当时鼓励专业帮助
6. **积极倾听**：反映您听到的内容，并在需要时提出澄清性问题
7. **实用指导**：在适当时提供实用的应对策略和技巧

您的回应应该是：
- 温暖且富有同理心但专业
- 2-4句话长度（简洁但有用）
- 专注于个人的情感福祉
- 无判断或偏见
- 在需要时鼓励专业帮助

记住：您是一位提供一般性支持的AI咨询师，不是专业心理健康护理的替代品。`
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, language = 'en' } = await request.json()

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

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const counselorResponse = data.choices[0]?.message?.content

    if (!counselorResponse) {
      throw new Error('No response from DeepSeek API')
    }

    return NextResponse.json({
      response: counselorResponse
    })

  } catch (error) {
    console.error('Counselor API error:', error)
    const errorResponse = language === 'zh'
      ? "抱歉，我现在连接有问题。请稍后再试，或考虑联系人类咨询师或心理健康专业人士获得即时支持。"
      : "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or consider reaching out to a human counselor or mental health professional for immediate support."
    
    return NextResponse.json(
      { response: errorResponse },
      { status: 500 }
    )
  }
} 