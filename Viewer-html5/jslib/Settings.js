if (this.RELite === undefined)
{
  RELite = {};
}

function Settings()
{
  this.defaultSeriesTiling = {
    rows: 1,
    cols: 2
  };
  
  /* {modality, description, window, level} */
  this.windowLevelPresets = [];
  
  this.bShowRefLines = true;
  this.bShowInfoOverlays = true;  
  this.iMaxMemory = 67108864;  
  this.infoOverlays = {
    bPatientName: true,
    bPatientSex: true,
    bPatientID: true,
    bPatientBirthDate: true,
    bSeriesDescription: true,
    bStudyDescription: true,
    bStudyComments: false,
    bAccNum: true,
    bNumOfFrames: true,
    bWinLevel: true,
    bStudyDate: true,    
    bSliceThickness: true
  };
  // http://127.0.0.1:8999
  this.sRemotEyeCodebase = "";
  this.sInitialTreeURL = "";
  this.sPushURL = "";
  this.sAuthenticationURL = "";
  this.bUseRedirect = false;
  this.sRedirectURL = /*window.location.protocol + "//" + window.location.host*/ "/Redirect.php";
  this.queryAETitlesURL = "";
  this.retrieveDataSetURL = "/RemotEyeLiteServer/RetrieveDICOMDataSet";
  this.retrieveDICOMImageURL = "/RemotEyeLiteServer/RetrieveDICOMImage";
  this.retrieveJPEGURL = "/RemotEyeLiteServer/RetrieveJPEG";
  this.retrieveSRURL = "/RemotEyeLiteServer/RetrieveSR";
  this.retrievePDFURL = "/RemotEyeLiteServer/RetrievePDF";
  
  this.iStudiesPerPage = 5;
  this.IMAGE_MAX_RETR = 3;
  this.bAutoStartCineSequences = false;
  
  this.bEnableHDOverlay = false;
  
  this.bTodayFilter = false;
  this.bLast7DaysFilter = true;
  this.bLastMonthFilter = false;
  
  this.bEnableHIPPICanvas = false;
  this.bEnableCustomTools = false;
  this.defaultWindowLevelPresets = [{
    modality:    "CT",
    description: "Chest",
    window:      350,
    level:       40
  },{
    modality:    "CT",
    description: "Abd/Pelvis",
    window:      350,
    level:       40
  },{
    modality:    "CT",
    description: "Lung",
    window:      1500,
    level:       -600
  },{
    modality:    "CT",
    description: "Brain",
    window:      80,
    level:       40
  },{
    modality:    "CT",
    description: "Bone",
    window:      2500,
    level:       480
  },{
    modality:    "CT",
    description: "Head Neck",
    window:      350,
    level:       90
  },{
    modality:    "MR",
    description: "Brain T1",
    window:      500,
    level:       250
  },{
    modality:    "MR",
    description: "Brain T2",
    window:      350,
    level:       150
  },{
    modality:    "MR",
    description: "Sag T2",
    window:      300,
    level:       150
  },{
    modality:    "MR",
    description: "Head/Neck",
    window:      500,
    level:       250
  },{
    modality:    "MR",
    description: "Spine",
    window:      500,
    level:       250
  },{
    modality:    "MR",
    description: "Abd/Pelvis T1",
    window:      590,
    level:       180
  },{
    modality:    "MR",
    description: "Abd/Pelvis T2",
    window:      835,
    level:       145
  },{
    modality:    "US",
    description: "Ultrasound [Low Contrast]",
    window:      190,
    level:       80
  },{
    modality:    "US",
    description: "Ultrasound [Medium Contrast]",
    window:      160,
    level:       70
  },{
    modality:    "US",
    description: "Ultrasound [High Contrast]",
    window:      120,
    level:       60
  }];

  this.periodicCallURLs = [];
  this.userPasswordChangeEnabled = false;
  this.viewerParametersEncryptionEnabled = false;
  this.autoLogoffTimeoutSecs = 0;
}

Settings.prototype.loadFromServer = function()
{
  var self = this;
  var data = {
    RELiteClient: true
  };
  var requestParams = {
    data:     data,
    async:    false,
    to:       self.sRemotEyeCodebase + "/RemotEyeLiteServer/RetrieveServerSettings",
    method:   "GET",
    success:  function(data, textStatus, jqXHR){
      var obj = null;
      try 
      {
        obj = JSON.parse(data);
        self.sInitialTreeURL = obj.initialTreeURL;
        self.sAuthenticationURL = obj.authenticationURL;
        self.retrieveDataSetURL = self.sRemotEyeCodebase + "/RemotEyeLiteServer/RetrieveDICOMDataSet";
        self.retrieveDICOMImageURL = self.sRemotEyeCodebase + "/RemotEyeLiteServer/RetrieveDICOMImage";
        
        if (obj.queryAETitlesURL)
        {
          self.queryAETitlesURL = self.sRemotEyeCodebase + "/RemotEyeLiteServer/QueryAETitles";
        }
        
        self.viewerParametersEncryptionEnabled = 
          obj.viewerParametersEncryptionEnabled;
        self.userPasswordChangeEnabled = 
          obj.userPasswordChangeEnabled;
        self.periodicCallURLs = obj.periodicCallURLs;
        self.autoLogoffTimeoutSecs = obj.autoLogoffTimeoutSecs;
        delete obj;
        obj = null;
        data = null;
        
        // emit event
        $(document).trigger("settings-ready");
      }
      catch(ex)
      {

      }
    }
  };
  RELite.Utils.doRequest(requestParams, self.bUseRedirect, false);
};

Settings.prototype.loadUserSettingsFromServer = function(callback)
{
  var self = this;
  var data = {
    Username: RELite.CredentialManager.getUsername(),
    AuthenticationToken: RELite.CredentialManager.getAuthenticationToken(),
    CliSessID: RELite.CredentialManager.cliSessID    
  };
  var bAsync = callback !== undefined;
  
  var requestParams = {
    data:     data,
    async:    bAsync,
    to:       self.sRemotEyeCodebase + "/RemotEyeLiteServer/RetrieveUserSettings",
    method:   "GET",
    success:  function(data, textStatus, jqXHR){
      var obj = null;
      try 
      {
        obj = JSON.parse(data);
        self.defaultSeriesTiling.rows = obj.defaultLayoutRows;
        self.defaultSeriesTiling.cols = obj.defaultLayoutColumns;
        if ((!obj.windowLevelPresets) || 
            (obj.windowLevelPresets && !obj.windowLevelPresets.length))
        {
          obj.windowLevelPresets = self.defaultWindowLevelPresets;
        }
        
        self.windowLevelPresets = obj.windowLevelPresets;
        
        self.bShowRefLines = obj.showRefLines;
        self.bShowInfoOverlays = obj.showOverlays;
        self.infoOverlays = {
          bPatientName:       obj.overlays.patientName,
          bPatientSex:        obj.overlays.patientSex,
          bPatientID:         obj.overlays.patientID,
          bPatientBirthDate:  obj.overlays.patientBirthDate,
          bModality:          obj.overlays.modality,
          bSeriesDescription: obj.overlays.seriesDescription,
          bNumOfFrames:       obj.overlays.numOfFrames,
          bWinLevel:          obj.overlays.winLevel,
          bStudyDate:         obj.overlays.studyDate,
          bStudyDescription:  obj.overlays.studyDescr,
          bStudyComments:     obj.overlays.studyComments,
          bSliceThickness:    obj.overlays.sliceThickness,
          bAccNum:            obj.overlays.accessionNum,
        };   
        self.bEnableHIPPICanvas = obj.enableHIPPICanvas;
      }
      catch(ex)
      {

      }
      if (callback)
      {
        callback();
      }
    }
  };
  RELite.Utils.doRequest(requestParams, self.bUseRedirect, false);
};

Settings.prototype.saveUserSettingsToServer = function()
{
  var self = this;
  var data = {
    Username: RELite.CredentialManager.getUsername(),
    AuthenticationToken: RELite.CredentialManager.getAuthenticationToken(),    
    CliSessID: RELite.CredentialManager.cliSessID,
    UserSettings: JSON.stringify({
      defaultLayoutRows: self.defaultSeriesTiling.rows,
      defaultLayoutColumns: self.defaultSeriesTiling.cols,
      windowLevelPresets: self.windowLevelPresets,
      showRefLines: self.bShowRefLines,
      showOverlays: self.bShowInfoOverlays,
      overlays: {
        patientName:        self.infoOverlays.bPatientName,
        patientSex:         self.infoOverlays.bPatientSex,
        patientID:          self.infoOverlays.bPatientID,
        patientBirthDate:   self.infoOverlays.bPatientBirthDate,
        seriesDescription:  self.infoOverlays.bSeriesDescription,
        modality:           self.infoOverlays.bModality,
        numOfFrames:        self.infoOverlays.bNumOfFrames,
        winLevel:           self.infoOverlays.bWinLevel,
        studyDate:          self.infoOverlays.bStudyDate,
        studyDescr:         self.infoOverlays.bStudyDescription,
        studyComments:      self.infoOverlays.bStudyComments,
        accessionNum:       self.infoOverlays.bAccNum,
        sliceThickness:     self.infoOverlays.bSliceThickness
      },
      enableHIPPICanvas: self.bEnableHIPPICanvas      
    })
  };
  var requestParams = {
    data:     data,    
    to:       self.sRemotEyeCodebase + "/RemotEyeLiteServer/StoreUserSettings",
    method:   "GET",
    success:  function(data, textStatus, jqXHR){
      
    }
  };
  RELite.Utils.doRequest(requestParams, self.bUseRedirect, false);
};

RELite.Settings = new Settings();


