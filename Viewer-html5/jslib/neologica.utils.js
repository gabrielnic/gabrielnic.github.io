if (this.NeoLogica === undefined)
{
  this.NeoLogica = {};
}

NeoLogica.Utils = (function(){

  var _isJavaActiveXComponentAvailable = function()
  {
    if (!('ActiveXObject' in window))
    {
      return false;
    }

    var aVer = [6, 7, 8, 9];
    var bFound = false;    
    for (var i = 0; i < aVer.length; i++)
    {
      var ver = aVer[i];
      try
      {
        // Detect Java X platform
        var obj = new ActiveXObject("JavaWebStart.isInstalled.1." + ver + ".0.0");
        if (obj !== null)
        {
          bFound = true;
          break;
        }        
      }
      catch (exception)
      {
        
      }
    }
    return bFound;
  };
  
  var _isJavaWSMimeTypeAvailable = function()
  {
    if (navigator.mimeTypes && navigator.mimeTypes.length)
    {
      var m = navigator.mimeTypes['application/x-java-jnlp-file'];
      if (m)
      {
        return true;
      }
    }
    return false;
  };
  
  var _isJavaAppletMimeTypeAvailable = function()
  {    
    var aVer = [6, 7, 8, 9];
    var bFound = false;
    if (navigator.mimeTypes && navigator.mimeTypes.length)
    {
      for (var i = 0; i < aVer.length; i++)
      {
        var ver = aVer[i];
        if (navigator.mimeTypes && navigator.mimeTypes.length)
        {
          var sMimeType = "application/x-java-applet;version=1." + ver;
          var m = navigator.mimeTypes[sMimeType];
          if (m)
          {
            bFound = true;
            break;
          }
        }
      }
    }
    return bFound;            
  };
  
  var _isJavaInstalled = function()
  {
    return _isJavaActiveXComponentAvailable() || 
           _isJavaWSMimeTypeAvailable()       ||
           _isJavaAppletMimeTypeAvailable();
  };
  
  var _isWindows = function()
  {    
    return (navigator.userAgent.indexOf("Windows") != -1);  
  };

  return {
    isJavaInstalled: _isJavaInstalled,
    isWindows: _isWindows
  };

})();