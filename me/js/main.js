/**
 * SA Editorial page
 * Consolidated for all apps.
 */
 'use strict';

 const sabm = new Vue({
   el : "#sabm",
  
   data : {
     email : "",
  
     loggedin : "",        // blank | true | false
     loginCallback : "",    // function after login
 
     params : {
      appref : "",        // appref after load
      page : ""          // page after load
     },
  
     mobileMain : false,    // open mobile menu
     mobileSub : false,     // open mobile sub
  
     hometitle : "",        // from sabm.xml
     intro : "",          // from sabm.xml
  
     page : "",          // page show 
     show : "login",        // state page (login/reqpass, not actual page)
     focusApp : "",        // focused appref
     links : [],          // sidebar links info
     editorials : {},      // editorial apps info
  
     ecommerce : "",       // isbn url
     website : "",        // website
     xwebsite : "",        // xtenit bookseller website
  
     error : "",          // error message - general
     success : "",        // success message - within form
     start : false,        // after login start.
     processing : false,    // page is processing an API request
     loading : false,      // show loading message
     pageSuccess : "",     // show success message - general
     pageSuccessTime : "",    // timeout of success message
     noAccess : "",        // show success message - general
     noAccessTime : "",    // timeout of success message
  
  
     confirmMessage : "",    // confirm message
     confirmCallback : "",  // function confirm if okay
  
     previewEditorial : false, // preview editorial
     previewSummary : "",     // preview summary
  
     showAuthPass : "",      // show/check authpass form
     authPassCallback : "",  // auth pass callback
 
     fields : {          // fields on form
      // login
      loginEmail : "",
      loginPassword : "",
      loginCookl : "",
  
      // reqpass
      reqpassEmail : "",
  
      // chgemail
      newEmail : "",
  
      // chgpass
      oldPassword : "",
      newPassword1 : "",
      newPassword2 : "",
  
      // auth password
      authPassword : "",
 
      // feedback option?
  
      // addeditorial
      msgCategory : "",
      msgTitle : "",
      msgPubdate : "",
      msgSummary : "",
  
      // book selection
      bookIsbn : ""
     },
 
     // account properties
     accountProp : {
     },
 
     // delay delivery
     readersAllowDelay : false,
     readersProp : {
       "DeliveryOption" : "",        // automated/delayed
       "DelayedDeliveryTime" : ""    // minutes
     },

     // edit tagline
     editTagline : true,
  
     apps : [],          // list of apps
  
     iframeSrc : "",     // iframe source
     iframeLoaded : false, // loaded?
 
     "pageList" : {
  
       "home" : {
         "needApp" : false,
         "name" : "Home"
       },
 
       "editorials" : {
         "needApp" : true,
         "name" : "My Editorials"
       },
 
       "addeditorial" : {
         "needApp" : true,
         "name" : "Write an Editorial",
         "category" : "",
         "pubdates" : [],
         "msgno" : "",
         "specialStatus" : "",
         "notes" : {
           "pubdate" : "",
           "summary" : ""
         }
       },
 
       "editpreorders" : {
         "needApp" : true,
         "name" : "Book Selection",
         "iframe" : true
       },
 
       "preferences" : {
         "needApp" : false,
         "name" : "Preferences"
       },
 
       "settings": { 
         "needApp" : false,
         "name" : "Account Settings"
       },
 
       "customizereaders": { 
         "needApp" : true,
         "name" : "Customize Newsletter"
       },
 
       "customizepreorders": { 
         "needApp" : true,
         "name" : "Customize Newsletter"
       },
 
       "customizeiba": { 
         "needApp" : true,
         "name" : "Customize Newsletter"
       },
 
       "gifenator": { 
         "needApp" : true,
         "name" : "GIF Generator"
       },
 
       "recommendations": { 
         "needApp" : true,
         "name" : "Staff Recommendations"
       }
     },  
  
     messages : {        // editorials page - move to pageList?
       show : "pending",
       pending : [],
       approved : []
     },
 
     // recommendation page settings
     reco : {
       name : "",       // name of recommendations page.
       max : 0,         // max books
       appref : "",     // reco appref
       preview : "",    // preview link
       config : "",     // custom headline config
     },

     // staff picks - 12 books max
     picks : [ 
       /*{ "image_url" : "https://media.shelf-awareness.com/images/books/I648/9781419746192.gif" },
       { "image_url" : "https://media.shelf-awareness.com/images/books/I648/9781982181536.gif"},
       { "image_url" : "https://media.shelf-awareness.com/images/books/I648/9781982181031.gif" },
       { "image_url" : "https://media.shelf-awareness.com/images/books/I648/9780316558792.gif" },
       { "image_url" : "https://media.shelf-awareness.com/images/books/I648/9780374181178.gif" }*/
     ],
     showSelectBook : false,   // show book selection
     noBookFound : "",  // found book
     loadPicks : false,  // first load
     BookInfo : {      // selected book
       ISBN : ""
       // other book info
     },
     canPick : true,    // can still add pick
 
     editPick : "",        // book for edit
     swapSelect : [],      // swap select index
  
     cgif : {
       show : false,
       seqno : "",
       appref : "preorders",  // hardcoded, for now
       issueUrl : "",        // issue url
       imageUrl : "",        // url
       booksHTML : ""        // list of books with links
     }
   },
  
   // when objects change.
   watch : {
  
     // loggedin 
     loggedin : function(val) {
  
      // logged in.
      if(val == "true") {
  
         // always get credentials first.
         this.getAccessInfo( () => {
 
           this.$nextTick(() => {
 
             // function?
             if(typeof this.loginCallback == "function") {
               this.loginCallback();
             }
   
             // based on url
             else if(this.params.page !== "") {
               // ex. ?app=indie&page=addeditorial
               const validPage = this.pageList[this.params.page] !== undefined;
               const validAppref = () => {
     
                 /*
                 // appref found...
                 if(this.editorials[this.params.appref] !== undefined) {
                   // .. and user contributor.
                   if(this.editorials[this.params.appref].isContributor) {
                     return true;
                   }
                 }*/
                 return Boolean(this.getApp(this.params.appref));
               };
   
               // console.log(validAppref(), "check");
 
               // is valid page
               if(validPage) {
 
                 // need app and valid app ref?
                 if(this.pageList[this.params.page].needApp && validAppref()) {
     
                   // editorial page
                   if(this.page.match("editorial") === null) {
                     // set msgno
                     this.pageList.addeditorial.msgno = this.params.msgno;
     
                     // render
                     this.renderEditorials(this.params.appref,this.params.page);
                   }
                 }
 
                 // not required app?
                 else if (!this.pageList[this.params.page].needApp) {
                   this.page = this.params.page;
                 }
     
                 // otherwise, home.
                 else {
                   this.page = "home";
                 }
               }
     
               // invalid page = home
               else {
                 this.page = "home";
               }
     
               // replace state to remove params - for now.
               window.history.replaceState(this.params, "", location.pathname);
     
               // clean up.
               this.params.page = "";
               this.params.appref = "";
               this.params.msgno = "";
               this.params.show = "";
             }
   
             // default?
             else {
               // available links?
               const links = document.querySelectorAll(".sb-lnk:not(.sb-lnk-head):not(.sb-lnk-disabled):not(.sb-lnk-href)");
     
               // click first available
               if(links.length > 0) {
                 links[0].click();
               }
     
               // preference page (not other access)
               else {
                 this.page = "home";
               }
             }
 
             // start, remove login
             this.start = true;
             this.show = "";
           });
         });
       }
     },
  
     // login/reqpass/addeditorial
     show : function() {
      this.clearFields();
      this.clearMessages();
     },
  
     // clear on timeout
     pageSuccess : function() {
      // clear existing timeout
      try {
         window.clearTimeout(this.pageSuccessTime);
      } catch(e) {}
  
      // remove in 5s
      this.pageSuccessTime = window.setTimeout(()=> {
         this.pageSuccess = "";
      },5000);
     },
 
     // clear on timeout
     noAccess : function() {
       // clear existing timeout
       try {
          window.clearTimeout(this.noAccessTime);
       } catch(e) {}
   
       // remove in 5s
       this.noAccessTime = window.setTimeout(()=> {
          this.noAccess = false;
       },5000);
      },
  
     // open/close mobile menu
     mobileMain : function(val) {
      if(!val) {
         document.querySelector(".main aside.mob-show").classList.remove("mob-show");
         document.querySelector("body").classList.remove("ofh");
      }
      else {
         document.querySelector(".main aside").classList.add("mob-show");
         document.querySelector("body").classList.add("ofh");
         this.mobileSub = false;
      }
     },
  
     // open/close mobile menu
     mobileSub : function(val) {
      if(!val) {
         document.querySelector(".head-btns.mob-show").classList.remove("mob-show");
      }
      else {
         document.querySelector(".head-btns").classList.add("mob-show");
         this.mobileMain = false;
      }
  
     },
  
     // user canceled.
     confirmMessage : function(val) {
  
      // cancel
      if(val === "") {
         document.querySelector("body").classList.remove("ofh");
      }
     },
  
     // preview editorial 
     previewEditorial : function(showPreview) {
      // set fields of title editorial
      if(showPreview) {
         this.previewSummary = tinymce.activeEditor.getContent();
      }
     },
  
     // app changes
     focusApp : function(val) {
      // scroll top
      window.scrollTo(0,0);
  
      this.$nextTick(() => {
         this.mobileMain = false;
         this.mobileSub = false;
      });
  
      // console.log(val);
     },
  
  
     // editorial reqpass
     page : function(val) {
       // scroll top
       window.scrollTo(0,0);
 
       this.$nextTick(() => {
         this.mobileMain = false;
         this.mobileSub = false;
         // this.setFocus();
       });
 
       // not app specific page? reset
       if(this.page.match("editorial") === null) {
         // console.log(this.focusApp);
         // this.focusApp = "";
       }
 
       // if the page is "addeditorial"
       if(val == "addeditorial") {
         // begin setup.
         const editorial = this.pageList.addeditorial.msgno !== "" ? this.getEditorial(this.pageList.addeditorial.msgno) : "";
         const editorialInfo = this.getApp(this.focusApp).editorial;
 
         // clear messages
         this.clearMessages();
 
         // update pubdate list
         this.updatePubdates();
 
         // added stuff
         this.pageList.addeditorial.notes.pubdate = editorialInfo.notes.pubdate;
         this.pageList.addeditorial.notes.summary = editorialInfo.notes.summary;
         
         // set field values
         //this.fields.msgCategory = editorialInfo.category;
         this.fields.msgCategory = "From My Shelf";
         this.fields.msgSpecialStatus = "";
         this.fields.msgPubdate = "";
         this.fields.msgTitle = "";
         this.fields.msgSummary = "";
 
         // editroail found or not false
         if(editorial !== "" && typeof editorial !== "boolean") {
           this.fields.msgSpecialStatus = editorial.meta["@SpecialStatus"];
 
           // set field values
           if(editorial.meta.pubdate !== undefined) {
             this.fields.msgPubdate = editorial.meta.pubdate;
           }
 
           if(editorial.meta.title !== undefined) {
             this.fields.msgTitle = editorial.meta.title.replace(/&quot;/g, '"');
           }
 
           // set content of tiny
           if(editorial.meta.summary !== undefined) {
             this.fields.msgSummary = editorial.meta.summary.replace(/&quot;/g, '"');
           }
         }
 
         // blank or has value
         try {
           tinymce.editors[0].setContent(this.fields.msgSummary);
           tinymce.editors[0].focus();
           // tinymce.activeEditor.setContent(this.fields.msgSummary);
         } catch(e) {
         }
       }
 
       if(val == "recommendations") {
         if(!this.loadPicks) {
           this.getStaffPicks(() => {
             // something
           });
         }
       }
 
      // change history - TEST
      // window.history.pushState({ page : this.page }, "", location.pathname + "?page=" + this.page );
     },
 
     // change app
     focusApp : function(val) {
       // scroll top
       window.scrollTo(0,0);
 
       this.$nextTick(() => {
         this.mobileMain = false;
         this.mobileSub = false;
         // this.setFocus();
       });
 
       // this.setFocus();
     }
   },
  
   // internal methods
   methods : {
  
     // ajax request
     request : function(command, requestXML, callback) {
       // clear error/success fields
       this.clearMessages();
 
       // processing something else
       if(!this.processing) {
  
         // start
         this.processing = true;
  
         fetch(`${ command.startsWith("/") ? command : "/subscriber/" + command }` , {
           method: "POST", 
           headers : {
             "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
           },
           body: `output=json&xml=${encodeURIComponent(requestXML)}`
           }).then(response => response.json())
           .then(data => {
             // end
             this.processing = false;
   
             // user got logged out error.
             if(data.results.error !== undefined) {
               if(data.results.error["@code"] == "2") {
     
                 // not logged in, show login
                 this.loggedin = "false";
                 this.show = "login";
     
                 // call same request.
                 this.loginCallback = () => {
                   this.request(command, requestXML, callback);
                 };
     
                 // tick after.
                 this.$nextTick(() => {
                   this.error = "Session expired. Please log in to continue action.";
                 });
     
                 return false;
               }
             }
   
             // callback
             callback(data.results);
         });
       }
  
       else {
         // alert("in progress..");
       }
     },
  
     // update pudpates - seleciton of dates in add ditorial
     updatePubdates : function() {
       // empty;
       this.pageList.addeditorial.pubdates = [];
 
       // traverse pending
       this.messages.pending.forEach( (editorial) => {
         // save all pubdates to list.
         this.pageList.addeditorial.pubdates.push(moment(editorial.meta.pubdate).format("YYYY-MM-DD"));
       });
 
         // traveres approved
         this.messages.approved.forEach( (editorial) => {
         // save all pubdates to list.
         this.pageList.addeditorial.pubdates.push(moment(editorial.meta.pubdate).format("YYYY-MM-DD"));
       });
     },
  
     // set page and appref
     renderEditorials : function(appref, page, show) {
       // from url param
       appref = appref === undefined ? this.focusApp : appref;
       page = page === undefined ? "editorials" : page;
       show = show === undefined ? "pending" : show;
 
       // not same focus app and not editorial page
       // if(this.focusApp !== appref || this.page.match("editorial") === null) {
       if(this.page.match("editorial") === null) {
         // close mobile menus
         this.mobileMain = false;
         this.mobileSub = false;
 
         // set loading and focus app
         this.loading = true;
 
         // retrieve available messages
         this.request(`Messages/retrieveMessages/${appref}`, "<request><ctrl><status>all</status><expired>true</expired></ctrl></request>", (result) => {
 
           this.messages.pending = [];
           this.messages.approved = [];
 
           // has no message? empty all
           if(result.messages !== undefined) {
 
             // object or array
             const messages = result.messages.message.length ? result.messages.message : [result.messages.message]
 
             // traverse
             messages.forEach( (editorial) => {
 
             const cat = this.editorials[appref] === undefined ? "From My Shelf" : this.editorials[appref];
 
             if(editorial.category == cat) {
             //if(editorial.category == "From My Shelf") {
                 // message status = 1 - pending
                 if(editorial.meta["@state"] == "1") {
                 this.messages.pending.push(editorial);
                 }
 
                 // approved
                 else {
                 this.messages.approved.push(editorial);
                 }
             }
             });
           }
 
           this.loading = false;
           this.focusApp = appref;
           this.page = page;
           this.messages.show = show;
         });
       }
     },
 
     // fetch access info from json
     getAccessInfo : function( callback ) {
       // fetch json, but assuming it works...
       // Object.assign(this, tempJSON.results);
 
       this.request("/"+this.params.env+"/js/access.json", "", (result) => {
         // set values.
         Object.assign(this, result);
 
         // account config update
         this.updateAccountFields(callback);
       }); 
     },
  
     // reselt all status messages
     clearMessages : function() {
       this.error = this.success = this.pageSuccess = "";
       this.noAccess = false;
 
       // remove error fields
       document.querySelectorAll(".error-field").forEach( (field) => {
         field.classList.remove("show");
       });
     },
  
     // reset all fields
     clearFields : function() {
       // clear
       for(let field in this.fields) {
         this.fields[field] = "";
       }
     },
  
     // clean values < > & "
     cleanValues : function(val) {
       return val === undefined ? "" : val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
     },    
  
     // clean values < > & "
     readyValues : function(val) {
       return val === undefined ? "" : val.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
     }, 
  
     // confirmation message
     confirmation : function(msg, callback) {
      // add confirm message and body block
      this.confirmMessage = msg;
      document.querySelector("body").classList.add("ofh");
  
      this.confirmCallback = () => {
         this.confirmMessage = "";
         document.querySelector("body").classList.remove("ofh");
  
         callback();
      };
     },
  
     // get editorial message
     getEditorial : function(msgno) {
      let selected = false;
  
      this.messages[this.messages.show].forEach( (editorial, index) => {  
         if(editorial.meta["@msgno"] === msgno) {
         selected = editorial;
         }
      });
  
      return selected;
     },
  
     // updated a pending editorial based on msgno
     updateEditorial : function(msgno, newEditorial) { 
  
      // console.log(msgno, newEditorial.meta["@msgno"]);
  
      // you can only edit pending messages anyway. 
      this.messages.pending.forEach( (editorial, index) => {     
         if(editorial.meta["@msgno"] === msgno) {
         this.messages.pending[index] = Object.assign({}, newEditorial);
  
         }
      });     
     },  
     
     // user leaves editorial add/edit
     leaveEditorial : function() {
      this.confirmation("Editorial is not yet saved. Continue?", () => {
         this.page = "editorials";
      });
     },
  
     // change email
     submitChgemail : function() {
       if(!this.processing) {
         // clear status messages
         this.clearMessages();
  
         const newEmail = this.fields.newEmail.trim();
  
         const errorResult = (text) => {
           // error 
           document.querySelector("#error-newemail b").innerHTML = text;
           document.querySelector("#error-newemail").classList.add("show");
   
           // focus
           document.querySelector("#newemail").focus();
         };
  
         // errors
         if(newEmail === "") {
           // error - required
           errorResult("New email is required");
         }
  
         // valid
         else {
           const xml = `<request><ctrl><newemail>${ newEmail }</newemail></ctrl></request>`;
   
           this.request("SubscriberSettings/changeemail", xml, (result) => {    
   
             if(result.status == "success") {
               this.pageSuccess = "An email has been sent to your current email to confirm."
               this.fields.newEmail = "";
             }
       
             else {
               // bad - error - probably taken
               errorResult(result.error["#text"]);
             }
           });
         }
       }
     },
  
     // change password
     submitChgpass : function() {
      if(!this.processing) {
         // clear status messages
         this.clearMessages();
  
         let hasError = false;
  
         const oldpass = this.fields.oldPassword;
         const newpass1 = this.fields.newPassword1;
         const newpass2 = this.fields.newPassword2;
  
         const errorResult = (text, id) => {
         // error 
         document.querySelector(`#error-${id} b`).innerHTML = text;
         document.querySelector(`#error-${id}`).classList.add("show");
  
         // focus
         document.querySelector(`#${id}`).focus();
         hasError = true;
         };
  
  
         if(newpass2 === "") {
         // error - required
         errorResult("Re-type New Password is required", "newpassword2");
         }
  
         if(newpass1 === "") {
         // error - required
         errorResult("New Password is required", "newpassword1");
         }
  
         if(oldpass === "") {
         // error - required
         errorResult("Current Password is required", "oldpassword");
         }
  
         // valid
         if(!hasError) {
           const xml = `<request><ctrl><oldpasswd>${ oldpass }</oldpasswd><newpasswd1>${ newpass1 }</newpasswd1><newpasswd2>${ newpass2 }</newpasswd2></ctrl></request>`;
   
           this.request("SubscriberSettings/changepassword", xml, (result) => {    
   
             if(result.status == "success") {
               this.pageSuccess = "Your password has been changed!"
               this.fields.oldPassword = this.fields.newPassword1 = this.fields.newPassword2 = "";
               }
       
             else {
               // not correct
               if(result.error["@code"] == "11") {
                 errorResult("Current password is not correct.", "oldpassword");
               }
     
               // new/old no match
               else {
                 errorResult("New passwords does not match.", "newpassword2");
                 errorResult("New passwords does not match.", "newpassword1");
               }
             }
           });
         }
      }
     },
  
     // login
     submitLogin : function() {
      if(!this.processing) {
         const loginEmail = this.fields.loginEmail.trim();
         const loginPassword = this.fields.loginPassword;
         const loginCookl = this.fields.loginCookl;
  
         // errors
         if(loginEmail === "") {
         this.error = "Missing Email Address";
         }
  
         else if(loginPassword === "") {
         this.error = "Missing Password";
         }
  
         // valid
         else {
         const xml = `<request><ctrl><username>${loginEmail}</username><password>${loginPassword}</password>${ loginCookl ? "<cookl>3</cookl>" : ""}</ctrl></request>`;
  
         this.request("Login/logon", xml, (result) => {    
           
           // user is logged in.
           if(result.status == "success") {
  
           // by setting this to true, this triggers the watcher function.
           this.loggedin = "true";
           }
     
           else {
  
           // bad - error
           this.error = "Invalid Email or Password";
           }
         });
         }
      }
     },
  
     // auth password
     submitAuthPass : function() {
       if(!this.processing) {
         // process submit.
         this.updateAccountFields(this.authPassCallback);
       }
     },
  
     // request password
     submitReqpass : function() {
      if(!this.processing) {
         // clear status messages
         this.clearMessages();
  
         const reqpassEmail = this.fields.reqpassEmail.trim();
  
         // errors
         if(reqpassEmail === "") {
         this.error = "Missing Email Address";
         }
  
         // valid
         else {
         const xml = `<request><ctrl><username>${ reqpassEmail }</username></ctrl></request>`;
  
         this.request("Login/requestPassword", xml, (result) => {    
  
           if(result.status == "success") {
           this.success = "New password sent to your email!"
           this.fields.reqpassEmail = "";
           }
     
           else {
           // bad - error
           this.error = "Invalid Email Address";
           }
         });
         }
      }
     },
  
     // add/edit editorial
     submitEditorial : function(submit) {
       const doApprove = typeof submit === "boolean" ? submit : false;
 
       if(!this.processing) {
         // clear status messages
         this.clearMessages();
 
         const editorial = this.pageList.addeditorial.msgno !== "" ? this.getEditorial(this.pageList.addeditorial.msgno) : "";
         const editorialInfo = this.getApp(this.focusApp).editorial;
 
         // set count
         tinymce.activeEditor.plugins.wordcount._count(tinymce.activeEditor);
 
         // missing content
         if(tinymce.activeEditor.plugins.wordcount._getCount(tinymce.activeEditor) == 0) {
           // error - summary required
           document.querySelector("#error-summary b").innerHTML = "Summary is required";
           document.querySelector("#error-summary").classList.add("show");
 
           // focus
           tinymce.activeEditor.focus();
           window.scrollTo(0, document.querySelector("#message-summary").parentElement.offsetTop)        
         }
 
         // max words
         if(editorialInfo.maxWords !== undefined) {
           // reached max words
           if(tinymce.activeEditor.plugins.wordcount._getCount(tinymce.activeEditor) > editorialInfo.maxWords) {
             // error
             document.querySelector("#error-summary b").innerHTML = `Maximimum of ${editorialInfo.maxWords} words only.`;
             document.querySelector("#error-summary").classList.add("show");  
 
             // focus
             tinymce.activeEditor.focus();
             window.scrollTo(0, document.querySelector("#message-summary").parentElement.offsetTop)
           }
         }
 
         // missing title
         if(this.fields.msgTitle === "") {
           // error
           document.querySelector("#error-title b").innerHTML = "Title is required";
           document.querySelector("#error-title").classList.add("show");
 
           // focus
           document.querySelector("#message-title").focus();
           window.scrollTo(0, document.querySelector("#message-title").parentElement.offsetTop)
         }
 
         // missing pubdate
         if(this.fields.msgPubdate === "") {
         document.querySelector("#error-pubdate b").innerHTML = "Publish date is required";
         document.querySelector("#error-pubdate").classList.add("show");
         
         // focus
         window.scrollTo(0, document.querySelector("#message-pubdate").parentElement.offsetTop)
         }      
 
         // no error
         if(document.querySelectorAll(".error-field.show").length == 0) {
 
         const processNow = () => {
           // xml for add/edit message
           const xml = `<request>
           <preset>message/sabm=true</preset>
           <preset>message/meta/title=${ this.cleanValues(this.fields.msgTitle) }</preset>
           <preset>message/meta/summary=${ this.cleanValues(tinymce.activeEditor.getContent()) }</preset>
           <preset>message/meta/pubdate=${ this.cleanValues(this.fields.msgPubdate) }</preset>
           <preset>message/category=${ this.cleanValues(this.fields.msgCategory) }</preset>
           <message><meta msgno='${ this.cleanValues(this.pageList.addeditorial.msgno) }'></meta></message>
           </request>`;
 
           this.loading = true;
 
           // add/edit message - because its an add.
           this.request(`Messages/editMessage/${this.focusApp}`, xml, (result) => {
             this.loading = false;
 
             // success.
             if(result.message !== undefined)  {
             
               // missing "m"
               if(result.message.meta["@msgno"].match("m") === null) {
                 // console.log("missing m");
                 result.message.meta["@msgno"] = "m" + result.message.meta["@msgno"];
               }
 
               // if edit = save new message object
               if(editorial !== "") {
                 this.updateEditorial(this.pageList.addeditorial.msgno, result.message);
               }
 
               // push to summary
               else {
                 this.messages.pending.unshift(result.message);
                 this.messages.pending[0].meta["@status"] = "new";
               }
 
               // save only?
               if(!doApprove) {
                 // pending editorials after save
                 this.messages.show = "pending";
                 this.page = "editorials";
 
                 // success message
                 if(editorial !== "") {
                   // if edit = save new message object
                   this.pageSuccess = "Editorial updated!"
                 }
 
                 else {
                   // remove after 5s
                   window.setTimeout(() => {
                   this.messages.pending[0].meta["@status"] = "";
                   }, 5000);
 
                   this.pageSuccess = "Editorial added!"  
                 }
               }
 
               // approve on save.
               else {
                 this.processEditorial("submit", editorial !== "" ? this.pageList.addeditorial.msgno : this.messages.pending[0].meta["@msgno"]);
               }          
             }  
           }); 
         }
 
         // if save and submit, question first
         if(doApprove) {
           this.confirmation("Submit editorial for review?", processNow);
         }
 
         // just process
         else {
           processNow();
         }
         }
       }
     },
  
     // form submit.
     processEditorial : function(action, msgno) {
  
      if(!this.processing) {
  
         // get editorial
         const editorial = msgno !== "" ? this.getEditorial(msgno) : "";
  
         // clear status messages
         this.clearMessages();
  
         // SUBMIT
         if(action == "submit") {
  
           if(editorial.meta['@SpecialStatus'] !== "For Approval" && editorial.meta.pubdate !== undefined) {
   
             const submitProcess = () => {          
               // submit editorial
               this.request(`Messages/approveMessage/${this.focusApp}`, `<request><messages><mno>${msgno}</mno></messages></request>`, (result) => {
                 if(result.status === "success") {
     
                   // missing "m"
                   if(result.message.meta["@msgno"].match("m") === null) {
                     // console.log("missing m");
                     result.message.meta["@msgno"] = "m" + result.message.meta["@msgno"];
                   }
     
                   // update copy
                   this.updateEditorial(msgno, result.message);
                   this.pageSuccess = "Editorial submitted for approval!";
     
                   // if not set.
                   this.messages.show = "pending";
                   this.page = "editorials";
                 }
               });
             };
   
             // only show in editorials
             if(this.page === "editorials") {
               this.confirmation("Submit editorial for review?", submitProcess);
             }
   
             // assume add editorial, just submit
             else {
             submitProcess();
             }
           }
         }
  
         // COPY
         else if(action == "copy") {
         this.confirmation("Copy this editorial?", () => {
           this.loading = true;
  
           // copy message
           this.request(`Messages/copyMessage/${this.focusApp}`, `<request><messages><mno>${msgno}</mno><remove>message/meta/pubdate</remove><remove>message/meta/@SpecialStatus</remove></messages></request>`, (result) => {
           this.loading = false;
  
           if(result.status === "success") {
  
              // missing "m"
              if(result.message.meta["@msgno"].match("m") === null) {
               // console.log("missing m");
               result.message.meta["@msgno"] = "m" + result.message.meta["@msgno"];
              }
  
              // add to pending
              this.messages.pending.unshift(result.message);
     
              // pending
              this.pageSuccess = "Editorial copied successfully."
           }
           });
         });
         }
  
         // FORWARD
         else if(action == "forward") {
           this.confirmation("Send proof to your email?", () => {
             this.loading = true;
   
             // copy message
             this.request(`Forward/forward/${this.focusApp}`, `<request command="forward"><ctrl><mno>${ msgno }</mno><subject>Editorial Proof: ${ editorial.meta.title }</subject><to>${ this.email }</to><from>bookstores@shelf-awareness.com</from></ctrl></request>`, (result) => {
             this.loading = false;
   
             if(result.status === "success") {
       
               // pending
               this.pageSuccess = "Editorial proof has been sent.";
             }
             });
           });
         }
         
         // DELETE
         else if(action == "delete") {
         this.confirmation("Delete this editorial?", () => {
           this.loading = true;
  
           // delete
           this.request(`Messages/deleteMessage/${this.focusApp}`, `<request><messages><mno>${msgno}</mno></messages></request>`, (result) => {
           this.loading = false;
  
           if(result.status === "success") {
              const pendingList = [];
  
              // can only delete pending items
              this.messages.pending.forEach( (editorial, index) => {     
               if(editorial.meta["@msgno"] !== msgno) {
                 pendingList.push(editorial);
               }
              });
     
              // new pending list without the object
              this.messages.pending = pendingList;
              this.pageSuccess = "Editorial deleted successfully."
           }
           });
         });
         }
      }
     },
 
     // readers update
     submitAppUpdateReaders : function() {
       if(!this.processing) {
         let xml = "<request command='update'><features>";
         
         // clear status messages
         this.clearMessages();
 
         xml += `<prop name="DeliveryOption" value="${this.readersProp.DelayedDeliveryTime !== "" ? "delayed" : "automated"}"/>`;
         xml += `<prop name="DelayedDeliveryTime" value="${this.readersProp.DelayedDeliveryTime}"/>`;
 
         xml += "</features></request>";
 
         this.loading = true;
 
         this.request("AppConfig/update/readers", xml, (result) => {
 
           if(result.status === "success") {
             // scroll top
             window.scrollTo(0,0);
 
             this.pageSuccess = "Delay Changes Saved!"
           }
 
           else {
             alert("Error");
           }
 
           this.loading = false;
         });
 
         return false;
       }
     },
  
     // request password
     submitAccountUpdate : function() {
 
       if(!this.processing) {
         let xml = "<request command='update'><features>";
         
         // clear status messages
         this.clearMessages();
 
         // based on appref
         switch(this.page) {
           // case blank - social media
           case "settings":
             xml += `<prop name="FacebookURL" value="${this.cleanValues(this.accountProp.FacebookURL)}"/>`;
             xml += `<prop name="TwitterURL" value="${this.cleanValues(this.accountProp.TwitterURL)}"/>`;
             xml += `<prop name="InstagramURL" value="${this.cleanValues(this.accountProp.InstagramURL)}"/>`;
             xml += `<prop name="PinterestURL" value="${this.cleanValues(this.accountProp.PinterestURL)}"/>`;
             xml += `<prop name="YoutubeURL" value="${this.cleanValues(this.accountProp.YoutubeURL)}"/>`;
             break;
 
           // readers
           case "customizereaders" : 
             /*xml += `<prop name="ReadersTagline" value="${this.cleanValues(tinymce.getInstanceById("sar-msg").getContent())}"/>`;*/
             xml += `<prop name="RecommendsTagline" value="${this.cleanValues(this.accountProp.RecommendsTagline)}"/>`;
             break;
 
           // preorderss
           case "customizepreorders" : 
             xml += `<prop name="POTagline" value="${this.cleanValues(this.accountProp.POTagline)}"/>`;
             xml += `<prop name="POHeader" value="${this.cleanValues(this.accountProp.POHeader)}"/>`;
             break;
 
           // regional
           case "customizeiba":
            xml += `<prop name="IBATagline" value="${this.cleanValues(tinymce.getInstanceById("iba-msg").getContent())}"/>`;
            xml += `<prop name="IBARecommendsTagline" value="${this.cleanValues(this.accountProp.IBARecommendsTagline)}"/>`;
          }
 
         xml += "</features></request>";
 
         this.loading = true;
 
         this.request("AccountConfig/update", xml, (result) => {
 
           if(result.status === "success") {
             // scroll top
             window.scrollTo(0,0);
 
             this.pageSuccess = "Changes have been saved!"
           }
 
           else {
             alert("Error");
           }
 
           this.loading = false;
         });
 
         return false;
       }
     },
  
     // change page
     changePage : function(link, app) {
       if(!link.isAllowed) {
         return false;
       }
 
       // clear iframe src
       this.iframeSrc = "";
       
       // iframe
       if (link.iframe) {
         // loading.
         this.loading = true;
         this.iframeSrc = link.href;
 
         // change page info?
         if(app !== undefined) {
           this.focusApp = app.appref;
         }
         this.page = link.page;
 
         // reload?
       }
 
       // if page is not blank
       else if(link.page !== undefined) {

         // set focus app
         if(app !== undefined) {        

           this.editTagline = app.hastagline !== undefined ? app.hastagline : true;

           if(app.reco !== undefined) {
             Object.assign(this.reco, app.reco);
           }           
           else {
             console.log("no reco");
             this.reco.appref = "";
           }

           if(link.page == "editorials") {
             return this.renderEditorials(app.appref);
           }
 
           // staff picks
           if(link.page == "recommendations") {
             return this.getStaffPicks(() => {
               this.focusApp = app.appref;
             });
           }
 
           this.focusApp = app.appref;
         }
 
         // no app
         else {
           this.focusApp = "";
         }
 
         // customize/settings
         if(link.requireAdmin) {
 
           // check authpass, clear field
           this.showAuthPass = "check";
           this.fields.authPassword = "";
 
           return this.updateAccountFields( ()=> {
             this.page = link.page;
           });
         }
 
         this.page = link.page;
       }
 
       // new window
       else {
         window.open(link.href, '_blank');
       }
     },
 
     // update fields that require account configs
     updateAccountFields : function(callback) {
       this.loading = true;
 
       let xml = "";
       if(this.fields.authPassword != "") {
         xml = `<request><ctrl><password>${this.fields.authPassword}</password></ctrl></request>`;
       }
 
       // retrieve account config
       this.request("AccountConfig/retrieve", xml, (result) => {
 
         const accAppComplete = () => {
           // done.
           this.loading = false;
 
           // this.start = false -- first call, always callback
           // else started and has access
           // console.log(this.start, this.noAccess);
 
           if(!this.start || (this.start && !this.noAccess)) {
             // do callback
             callback();
           }
         };
 
         // access : get props.
         if(result.status === "success") {
 
           // clear auth pass check fields
           this.fields.authPassword = "";
           this.showAuthPass = "";
           this.authPassCallback = "";
           this.noAccess = false;
 
           result.features.prop.forEach ( (property) => {
             // add prop
             this.accountProp[property["@name"]] = this.readyValues(property["@value"]);
           
             // tinymce
             try {
               // readers
               if(property["@name"] === "ReadersTagline") {
                 tinymce.getInstanceById("sar-msg").setContent(this.accountProp[property["@name"]]);
               }
 
               // iBA
               if(property["@name"] === "IBATagline") {
                 tinymce.getInstanceById("iba-msg").setContent(this.accountProp[property["@name"]]);
               }
             } catch(e) {
               // console.log(e);
             }
           });
 
           // get readers values
           this.request("AppConfig/retrieve/readers", xml, (result) => {
 
             // has permission
             if(result.status !== "error") {
               this.readersProp.DeliveryOption = result.features.prop;
 
               // obj or arraay
               result.features.prop = result.features.prop.length === undefined ? [result.features.prop] : result.features.prop;
               
               // console.log(result.features.prop.length)
 
               result.features.prop.forEach ( (property) => {
                 // add prop
                 this.readersProp[property["@name"]] = this.readyValues(property["@value"]);
               });
 
               this.readersAllowDelay = (this.readersProp.DeliveryOption == "automated" || this.readersProp.DeliveryOption == "delayed");
             }
 
             accAppComplete();
           });
 
           return;
         }     
 
         // login auth password
         else if(result.error["@rcode"] == "45") {
           this.error = "Invalid password.";
           this.loading = false;
           return;
         }
 
         // login auth invalid
         else if(result.error["@rcode"] == "51") {
 
           if(this.showAuthPass == "check") {
             // require password on access.
             this.showAuthPass = "true";
             this.authPassCallback = callback;
             this.authPassword = "";
             this.error = "Please re-enter your password to access this page.";
             this.loading = false;
             return;
           }
         }
 
         // no access
         else {
           // disable links
           const checkLink = (link) => {
             if(link.requireAdmin) {
               link.isAllowed = false;
             }
           };
 
           // for each app
           this.apps.forEach( (app) => {
             app.links.forEach ( checkLink );
           });
 
           // for each link
           this.links.forEach( checkLink );
 
           // clear
           this.fields.authPassword = "";
           this.showAuthPass = "";
           this.authPassCallback = "";
 
           // show error
           this.noAccess = true;
         }
 
         accAppComplete();
       });
     },
 
     // get app based on appref
     getApp : function (appref) {
       // find app based on appref
       let findApp = false;
       this.apps.forEach((app) => {
         if(app.appref == appref) {
           findApp = app;
         }
       });
 
       // nothing found
       return findApp;
     },
  
     // gifenator
     createGif : function(event) {
      // console.log(this.cgif.seqno, this.cgif.appref, this.website, this.xwebsite);
  
      // generate: https://test1-bookseller.objects.xtenit.com/imgs/cgif/preorders/j/19
      // https://${this.xwebsite}/imgs/cgif/{this.cgif.appref}/j/${this.cgif.seqno}
      this.loading = true;
      this.cgif.show = false;
  
      const image = new Image();
      image.onload = () => {
         this.cgif.imageUrl = `https://${this.xwebsite}/imgs/cgif/${this.cgif.appref}/j/${this.cgif.seqno}`;
         this.cgif.issueUrl = `https://${this.website}/${this.cgif.appref}?issue=${this.cgif.seqno}`
  
         // fetch
         // https://test1.shelf-awareness.com/booksellers/preorders-fetch.html?issue=21
         fetch(`/booksellers/${this.cgif.appref}-fetch.html?issue=${this.cgif.seqno}`)
         .then(response => response.text())
           .then(html => {
           this.cgif.booksHTML = html;
           this.cgif.show = true;
           this.loading = false;
           });
         };
      image.src = `https://${this.xwebsite}/imgs/cgif/${this.cgif.appref}/j/${this.cgif.seqno}`;
     },
  
     // can add more picks
     canAddPick : function () {
        console.log("check if can add more picks");

        // has more picks than limit
        if(!this.reco.max && this.picks.length >= this.reco.max) {
          this.canPick = false;
        }

        else {
          this.canPick = true;
        }
     },
 
     // staff picks
     getStaffPicks : function(callback) {
       if(!this.processing) {
 
         // set loading and focus app
         this.loading = true;
 
         // this.request("/"+this.params.env+"/js/picks.json", "", (result) => {
         this.request(`/subscriber/Messages/${this.reco.appref}`, "<request command='retrieveMessages'><ctrl><status>approved</status><showall>true</showall></ctrl></request>", (result) => {
 
           this.loadPicks = true;
 
           const complete = () => {
             // console.log("next tick");
 
             // remove book selection, could be from update
             this.showSelectBook = false;
 
             // clear swap pick
             this.swapSelect = [];
 
             // set settings
             // this.focusApp = appref;
             this.page = "recommendations";
 
             this.loading = false;
             this.canAddPick();
 
             if(callback) {
               callback();
             }
           };
 
           // clear picks first
           this.picks = [];
 
           // next tick
           this.$nextTick( () => {
             
             // copy messages
             if(result.messages) {
 
               // object? make an array
               if(!result.messages.message.length) {
                 result.messages.message = [result.messages.message];
               }
 
               else {
                 // sort
                 result.messages.message.sort((a,b) => {
                   return Number(b.meta["@priority"]) - Number(a.meta["@priority"]) || Number(b.meta["@msgid"]) - Number(a.meta["@msgid"]);
                 });
               }
 
               this.picks = result.messages.message;
 
               /*
               // start loading images.
               let picksLoaded = 0;
 
               this.picks.forEach( (msg) => {
                 if(msg.CoverImage) {
 
                   const imageLoad = new Image();
                   imageLoad.src = msg.CoverImage;
                   imageLoad.onload = function() {
                     picksLoaded++;
 
                     // loaded one
                     if(picksLoaded == 1) {
                       console.log("complete staff recommendations")
                       
                     }
                   };
                 }
               });
 
               // think of something..
               complete();
               */
             }
 
             // complete
             complete();
           });
         }); 
       }
     },
  
     // get ecommerce link
     getEcommerce : function(isbn) {
       return this.ecommerce.replace('[/extra/isbn]',isbn);
     },
 
     // search book
     searchBook : function() {
       if(!this.processing) {
 
         // contributor, illustrator, translator
         const extractRole = (contributors, roles) => {
           let con = [];
 
           // make an array.
           roles = typeof roles === "string" ? [roles] : roles;
 
           // no value
           if(typeof contributors === "undefined") {
             return [];
           }
 
           // make an array if only one object
           else if(contributors.Name) {
             contributors = [contributors];
           }
 
           // traverse array, return only if specified role
           for(let contributor of contributors) {
             for(let role of roles) {
               if(contributor.Role === role) {
 
                 // return as First Name then Last Name
                 if(contributor.Name.match(",") !== null) {
                   con.push(`${contributor.Name.split(", ")[1]} ${contributor.Name.split(", ")[0]}`)
                 }
                 
                 // add as is
                 else {
                   con.push(contributor.Name)
                 }
 
               }
             }
           }
 
           // array if has value, undefined if none (so as not to generate object)
           return con.length > 0 ? con : [];
         };
 
         // trim
         try {
           this.fields.bookIsbn = this.fields.bookIsbn.trim();
         } catch(e) {
 
         }
 
         if(this.fields.bookIsbn !== "") {
           this.loading = true;
 
           // remove, try to find
           this.noBookFound = "";
           
           // retrieve account config
           this.request("Feed/apiFeed", `<request><name>ingram</name><parameters><isbn>${this.fields.bookIsbn}</isbn></parameters></request>`, (result) => {
             this.loading = false;
 
             if(result.IngramSearchResults !== undefined) {
 
               if(result.IngramSearchResults.Book === undefined) {
                 // error, focus
                 this.noBookFound = "No Book Found.";
                 this.$nextTick(() => {
                   this.$refs.bookIsbn.focus();
                 });
               }
   
               else {
   
                 // traverse list of books. check if there is a match.
                 for(let i=0; i<this.picks.length; i++) {
                   if(this.picks[i].BookInfo.ISBN === this.fields.bookIsbn) {
                     // error, duplicate book
                     this.noBookFound = "Book already in use.";
                     this.$nextTick(() => {
                       this.$refs.bookIsbn.focus();
                     });
                     return;
                   }
                 }
 
                 // empty important book info
                 this.BookInfo.ISBN = "";
                 this.BookInfo.image = "";
                 this.BookInfo.description = "";
                 this.BookInfo.Title = "";
   
                 this.$nextTick(() => {
               
                   // show book
                   let bookInfo = this.BookInfo;
                   let book = result.IngramSearchResults.Book;
             
                   // isbn, image, summary
                   bookInfo.ISBN = book.Basic.EAN;
                   bookInfo.image = book.Basic.Image ? book.Basic.Image.IMG648 : result.IngramSearchResults.ImageURL;
                   bookInfo.description = result.IngramSearchResults.PublisherMarketing;
               
                   // book info
                   bookInfo.ContributorName = extractRole(book.Basic.Contributor, ["Author", "Editor"]);
                   bookInfo.Illustrator = extractRole(book.Basic.Contributor, "Illustrator");
                   bookInfo.Translator = extractRole(book.Basic.Contributor, "Translator");
                   
                   // title - include Title Leading Article
                   bookInfo.Title = (book.Basic.TitleLeadingArticle !== undefined ? `${book.Basic.TitleLeadingArticle} ` : "") + book.Basic.Title;
               
                   // categories (multiple)
                   bookInfo.Categories = (() => {
                       let bisacSubject = book.Basic.BisacSubject.length ? book.Basic.BisacSubject : [book.Basic.BisacSubject];
                       let categories = [];
               
                       bisacSubject.forEach((category) => {
                           category.Description.split(" | ").forEach((cat) => {
                               categories.push(cat);
                           });
                       });
               
                       // return only unique elements
                       return [... new Set(categories)];
                   })();
               
                   // publisher imprint
                   bookInfo.PublisherImprint = book.Basic.Publisher;
               
                   // publication date
                   bookInfo.PublicationDate = book.Basic.PubDate;
               
                   // price
                   bookInfo.Price = book.Basic.PubListPrice;
               
                   // binding type
                   bookInfo.BindingType = book.Basic.Binding;
                       
                   // source = hardcoded
                   bookInfo.Source = "Ingram";
               
                   // reload
                   bookInfo.Reload = "Do Not Retrieve";
               
                   // Ages /IngramSearchResults/Book/Basic/Audience/Age/Min, /IngramSearchResults/Book/Basic/Audience/Age/Max
                   if(book.Basic.Audience.Age.Min) {
                       bookInfo.Ages = book.Basic.Audience.Age.Min ===  "NA" ? "" : book.Basic.Audience.Age.Min;
                       if(book.Basic.Audience.Age.Max) {
                           bookInfo.Ages += book.Basic.Audience.Age.Max ===  "NA" ? "" : "-"+book.Basic.Audience.Age.Max;
                       }
                   }
               
                   // pages
                   bookInfo.Pages = book.Basic.Pages;     
                 });
               }              
 
             }
 
             else {
               // error, focus
               this.noBookFound = "No Book Found.";
               this.$nextTick(() => {
                 this.$refs.bookIsbn.focus();
               });
             }
           });
         }
 
         else {
           this.$nextTick(() => {
             this.$refs.bookIsbn.focus();
           });
         }
       }
     },
 
     displayContributor : function() {
       // list contributor, add ", " if not last
       let results = "";
       
       // creates array of obj if not arry
       const createArray = (obj) => {
         return obj = typeof obj === "object" ? obj : [obj];
       };
 
       const getContributors = (contributors) => {
         let result = "";
 
         contributors.forEach((value, i) => {
           result += value;
 
           //console.log(value, i, contributors.length, i+1 == contributors.length, i+1 < contributors.length);
           
           // last
           if(i+2 == contributors.length) {
             result += " and "
           }
 
           // otherwise.
           else if(i+2 < contributors.length) {
             result += ", "
           }
 
           // console.log(results);
         });
 
         return result;
     }
 
       // contributor
       if(this.BookInfo.ContributorName) {
         if(this.BookInfo.ContributorName.length > 0) {
             this.BookInfo.ContributorName = createArray(this.BookInfo.ContributorName);
             results = getContributors(this.BookInfo.ContributorName);
         }
       }
 
       // translator
       if(this.BookInfo.Translator) {
         if(this.BookInfo.Translator.length > 0) {
             this.BookInfo.Translator = createArray(this.BookInfo.Translator);
             results += `, trans. by ${getContributors(this.BookInfo.Translator)}`;
         }
       }
 
       // illustrator
       if(this.BookInfo.Illustrator) {
         if(this.BookInfo.Illustrator.length > 0) {
             this.BookInfo.Illustrator = createArray(this.BookInfo.Illustrator);
             results += `, illus. by ${getContributors(this.BookInfo.Illustrator)}`;
         }
       }
 
       return results;
     },
 
     // add/edit pick. isbn is undefined if add
     updatePick : function(index) {
 
       if(!this.processing) {
         // remove swap selection
         this.swapSelect = [];
 
         // clear previous selection
         this.BookInfo.ISBN = "";
         this.fields.bookIsbn = "";
         this.noBookFound = false;
 
         // set either add or edit
         this.editPick = index === undefined ? "" : this.picks[index];
 
         // TODO: populate this.BookInfo with record from message.
         // populate isbn fields with specific message isbn
         if(this.editPick !== "") {
           // create copy
           this.BookInfo = JSON.parse(JSON.stringify(this.editPick.BookInfo));
 
           // image and description
           this.BookInfo.image = this.editPick.CoverImage;
           this.BookInfo.description = this.editPick.meta.summary;
 
           // isbn field
           this.fields.bookIsbn = this.BookInfo.ISBN;
         }
 
         // show
         this.$nextTick(() => {
           this.showSelectBook = true;
 
           // focus.
           this.$nextTick(() => {
             this.$refs.bookIsbn.focus();
             this.$refs.bookIsbn.select();
           });
         });
       }
     },
 
     // submit
     processUpdatePick : function() {
       if(!this.processing) {
 
         let xml = this.createPicksXML();
 
         // https
         xml = xml.replaceAll("http://CWS", "https://CWS");
 
         this.loading = true;
 
         // add pick
         this.request(`Messages/editMessage/${this.reco.appref}`, xml, (result) => {
 
           // success.
           if(result.message !== undefined)  {
 
             // state = '2' - alredy approved. reload.
             if(result.message.meta["@state"] == "2") {
               this.getStaffPicks(() => {
                 this.loading = false;
                 this.pageSuccess = "Your book has been updated!"
               });
             }
 
             // else, new message. get message id then approve.
             else {
               this.request(`Messages/approveMessage/${this.reco.appref}`, `<request><messages><mno>${result.message.meta["@msgno"]}</mno></messages></request>`, (result2) => {
 
                 // good.
                 if(result2.status === "success") {
                   this.getStaffPicks(() => {
                     this.loading = false;
                     this.pageSuccess = "Your book has been added!"
                     this.canAddPick();
                   });
                 }
 
                 else {
                   alert("Error updating book. Try again later.");
                 }
               });
             }
           }
 
           else {
             alert("Error updating book. Try again later.");
           }
         });
       }
     },
 
     // swap pick
     swapPick : function(i) {
       // console.log(this.swapSelect, this.swapSelect );
 
       // if no pick 1, set as pick one
       if(this.swapSelect.length === 0) {
         this.swapSelect.push(i);
       }
 
       // clear
       else if(this.swapSelect.includes(i)) {
         this.swapSelect = [];
       }
 
       else {
         if(!this.processing) {
 
             // if has pick 1, confirm swap.
           this.confirmation("Swap book locations?", () => {
             
             // add to array
             this.swapSelect.push(i);
             this.loading = true;
 
             // next tick
             this.$nextTick(() => {
 
               let msg1 = JSON.parse(JSON.stringify(this.picks[this.swapSelect[0]]));
               let msg2 = JSON.parse(JSON.stringify(this.picks[this.swapSelect[1]]));
 
               // console.log(msg1.meta["@msgno"], msg1.meta["@priority"]);
               // console.log(msg2.meta["@msgno"], msg2.meta["@priority"]);
 
               const editMessage = (xml, callback) => {
                 this.request(`Messages/editMessage/${this.reco.appref}`, xml, (result) => {
 
                   // success.
                   if(result.message !== undefined)  {
                     callback(result);
                     return;
                   }
 
                   alert("error occured.")
                   this.loading = false;
                 });
               };
 
               // edit message 1
               editMessage(`<request><preset>message/meta/@priority=${msg2.meta["@priority"]}</preset><message><meta msgno="${msg1.meta["@msgno"]}"></meta></message></request>`, () => {
 
                 // edit message 2
                 editMessage(`<request><preset>message/meta/@priority=${msg1.meta["@priority"]}</preset><message><meta msgno="${msg2.meta["@msgno"]}"></meta></message></request>`, () => {
 
                   this.getStaffPicks(()=> {
                     this.loading = false;
                     this.pageSuccess = "Book positions has been updated!";
                   });
                 });
               });            
             });            
           });
         }
       }
     },
 
     // delete pick
     deletePick : function(i) {
       if(!this.processing) {
         // remove swap selection
         this.swapSelect = "";
 
         // confirm delete pick
         this.confirmation("Delete this book?", () => {
           this.loading = true;
   
           // delete
           this.request(`Messages/deleteMessage/${this.reco.appref}`, `<request><messages><mno>${this.picks[i].meta["@msgno"]}</mno></messages></request>`, (result) => {
 
             const complete = () => {
               this.getStaffPicks(()=> {
                 this.loading = false;
                 this.pageSuccess = "The book has been deleted!";
                 this.canAddPick();
               });
             };
 
             if(result.status === "success") {
               complete();
             }
 
             // no permission
             else if(result.error["@rcode"] = "157"){
 
               // unapprove instead
               this.request(`Messages/unapproveMessage/recommendations`, `<request><messages><mno>${this.picks[i].meta["@msgno"]}</mno></messages></request>`, (result) => {
 
                 if(result.status === "success") {
                   complete();
                 }
 
                 // dunno
                 else {
                   alert("Could not delete. Try again later.")
                   this.loading = false;
                 }
               });
             }
           });
         });
       }
     },
 
     createPicksXML : function() {
       let message = {
         meta : {
           "@priority" : "0"
         },
         BookInfo : {}
       };
 
       // copy existing message info.
       if(this.editPick != "") {
         message = JSON.parse(JSON.stringify(this.editPick));
       }
 
       // set priority to top most + 1
       else if(this.picks.length == 0) {
         message.meta["@priority"] = "1";
       }
 
       // set priority to top most + 1
       else {
         message.meta["@priority"] = Number(this.picks[0].meta["@priority"]) + 1;
       }
 
       // copy BookInfo
       message.BookInfo = JSON.parse(JSON.stringify(this.BookInfo));
 
       // copy meta title and description
       message.meta.title = this.BookInfo.Title;
       message.meta.summary = this.BookInfo.description;
       message.CoverImage = this.BookInfo.image;
 
       // add category = "Bookstore Recommendations"
       message.category = "Bookstore Recommendations";
 
       // remove image/description
       delete message.BookInfo.image;
       delete message.BookInfo.description;
 
       // create xml - convert object to XML
       return `<request><message>${(new X2JS({
         attributePrefix : "@"
       })).json2xml_str(message).replace(/&#x2F;/gi,"/").replace(/&#x27;/gi,"'")}</message></request>`;      
     },
 
     // start
     init : function(settings) {
      
      // get intro and hometitle
      this.request("Feed/apiFeed", "<request><name>sabm</name></request>", (result) => {
  
         // title and description
         this.hometitle = result.message.title;
         this.intro = result.message.description.replace(/&quot;/g, '"');
  
         // set default - trigger watch
         this.loggedin = settings.loggedin;     
  
         // load pages
         this.params.appref = settings.appref;
         this.params.page = settings.page;
         this.params.msgno = settings.msgno;
         this.params.show = settings.show;
         this.params.env = settings.env;
  
         // website
         this.website = settings.website;
         this.xwebsite = settings.xwebsite;
         this.ecommerce = settings.ecommerce;
  
         // if appref but no page? default "editorials"
         if(this.params.appref != "" && this.params.page == "") {
           this.params.page = "home";
         }
 
         // iframe - new
         // on load
         document.getElementById("xtntiframe").onload = () => {
           // if iframe is src is not blank, set loading to false
           if(this.iframeSrc !== "") {
             this.loading = false;
           }
 
           // console.log(this.page, this.iframeSrc);  
         };
      });         
     }
   }, 
  
   // Computed functions
   computed : {
 
     // get title
     getPageTitle : function() {
      if(this.page !== "") {
  
         if(this.page == "home") {
         return this.hometitle;
         }

         if(this.page == "recommendations") {
           return this.reco.name;
         }
  
         return this.pageList[this.page].name;
      }
      return "";
     },
     
     // 
     getAppName : function() {
      if(this.focusApp !== "") {
         return `<a class="appname-issue tt tt-sa tt-right" data-tooltip="View Latest Issue" href="/${this.focusApp}" target="_blank"><span class="mt-icons">visibility</span><span>${this.getApp(this.focusApp).name}</span></a>`;
         // this.apps[this.focusApp].name;
      }
      return "";
     }
   }
  });