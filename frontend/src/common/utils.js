const validateCoverUrl = (url) => {
    const urlPattern = /^(http:\/\/|https:\/\/|data:image\/)(.*(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.svg|\.webp).*)|(.*image.*)$/i;
    return urlPattern.test(url);
  };
  
  export default validateCoverUrl;