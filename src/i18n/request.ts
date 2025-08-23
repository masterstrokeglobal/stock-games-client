import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales} from './config';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming locale is supported
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  
  console.log(`🔍 i18n request: locale=${locale}, validLocale=${validLocale}`);

  try {
    // Import the messages for the valid locale
    const messages = (await import(`../../messages/${validLocale}.json`)).default;
    
    console.log(`✅ Loaded messages for ${validLocale}:`, {
      hasPlatform: !!messages.platform,
      hasWallet: !!messages.wallet,
      hasForgotPassword: !!messages.forgotPassword,
      platformKeys: Object.keys(messages.platform || {}),
      messageKeys: Object.keys(messages)
    });
    
    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    console.error(`❌ Failed to load messages for locale '${validLocale}':`, error);
    
    // Fallback to default locale if the requested locale file doesn't exist
    try {
      const fallbackMessages = (await import(`../../messages/${defaultLocale}.json`)).default;
      console.log(`✅ Loaded fallback messages for ${defaultLocale}`);
      
      return {
        locale: defaultLocale,
        messages: fallbackMessages
      };
    } catch (fallbackError) {
      console.error(`❌ Failed to load fallback messages for locale '${defaultLocale}':`, fallbackError);
      
      // Last resort: return empty messages
      console.warn(`⚠️ Returning empty messages as last resort`);
      return {
        locale: defaultLocale,
        messages: {}
      };
    }
  }
});
