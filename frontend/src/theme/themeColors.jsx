export const themeColors = {
    lime: {
      bg: {
        200: 'bg-lime-200',
        300: 'bg-lime-300',
        400: 'bg-lime-400',
        500: 'bg-lime-500',
        600: 'bg-lime-600',
        
      },
      text: {
        200: 'text-lime-200',
        300: 'text-lime-300',
        400: 'text-lime-400',
        default: 'text-black',
      },
      hover: {
        300: 'hover:text-lime-300',
      },
    },
    purple: {
      bg: {
        200: 'bg-purple-200',
        300: 'bg-purple-300',
        400: 'bg-purple-400',
        500: 'bg-purple-500',
        600: 'bg-purple-600',
      },
      text: {
        200: 'text-purple-200',
        300: 'text-purple-300',
        400: 'text-purple-400',
        default: 'text-white',
      },
      hover: {
        300: 'hover:text-purple-300',
        
      },
    },
  };
  
  export const getBgColor = (theme, level) => themeColors[theme]?.bg?.[level] || '';
  export const getTextColor = (theme, level) => themeColors[theme]?.text?.[level] || '';
  export const getTextDefault = (theme) => themeColors[theme]?.text?.default || '';
  export const getHoverColor = (theme, level) => themeColors[theme]?.hover?.[level] || '';
  