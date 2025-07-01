export const translations = {
  en: {
    title: "AI Counselor",
    subtitle: "Professional & Compassionate Support",
    welcome: "Hello, I'm your professional counselor. I'm here to provide professional, compassionate, and unbiased support. How are you feeling today?",
    placeholder: "Share what's on your mind...",
    send: "Send",
    features: {
      professional: {
        title: "Professional & Unbiased",
        description: "Our AI counselor provides professional support while maintaining complete objectivity and neutrality."
      },
      compassionate: {
        title: "Compassionate Support",
        description: "Receive empathetic and understanding responses designed to help you feel heard and supported."
      },
      availability: {
        title: "24/7 Availability",
        description: "Access professional counseling support whenever you need it, day or night."
      }
    },
    disclaimer: {
      title: "Important:",
      text: "This AI counselor is designed to provide general support and should not replace professional mental health care. If you're experiencing a crisis or need immediate help, please contact emergency services or a mental health professional."
    },
    crisis: {
      title: "Crisis Resources",
      suicide: "National Suicide Prevention Lifeline: 988",
      text: "Crisis Text Line: Text HOME to 741741",
      emergency: "Emergency Services: 911"
    }
  },
  zh: {
    title: "AI 心理咨询师",
    subtitle: "专业且富有同情心的支持",
    welcome: "您好，我是您的专业心理咨询师。我在这里为您提供专业、富有同情心且无偏见的支持。您今天感觉如何？",
    placeholder: "分享您的想法...",
    send: "发送",
    features: {
      professional: {
        title: "专业且无偏见",
        description: "我们的AI咨询师提供专业支持，同时保持完全的客观性和中立性。"
      },
      compassionate: {
        title: "富有同情心的支持",
        description: "获得富有同理心和理解力的回应，旨在帮助您感到被倾听和支持。"
      },
      availability: {
        title: "24/7 全天候服务",
        description: "无论何时需要，都能获得专业的心理咨询支持。"
      }
    },
    disclaimer: {
      title: "重要提示：",
      text: "此AI咨询师旨在提供一般性支持，不应替代专业的心理健康护理。如果您正在经历危机或需要立即帮助，请联系紧急服务或心理健康专业人士。"
    },
    crisis: {
      title: "危机资源",
      suicide: "全国自杀预防热线：988",
      text: "危机短信热线：发送HOME到741741",
      emergency: "紧急服务：911"
    }
  }
}

export type Language = 'en' | 'zh'
export type TranslationKey = keyof typeof translations.en 