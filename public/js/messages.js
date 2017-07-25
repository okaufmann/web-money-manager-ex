/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.7
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.Lang=factory()}})(this,function(){"use strict";function inferLocale(){if(typeof document!=="undefined"&&document.documentElement){return document.documentElement.lang}}function convertNumber(str){if(str==="-Inf"){return-Infinity}else if(str==="+Inf"||str==="Inf"||str==="*"){return Infinity}return parseInt(str,10)}var intervalRegexp=/^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;var anyIntervalRegexp=/({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;var defaults={locale:"en"};var Lang=function(options){options=options||{};this.locale=options.locale||inferLocale()||defaults.locale;this.fallback=options.fallback;this.messages=options.messages};Lang.prototype.setMessages=function(messages){this.messages=messages};Lang.prototype.getLocale=function(){return this.locale||options.fallback};Lang.prototype.setLocale=function(locale){this.locale=locale};Lang.prototype.getFallback=function(){return this.fallback};Lang.prototype.setFallback=function(fallback){this.fallback=fallback};Lang.prototype.has=function(key,locale){if(typeof key!=="string"||!this.messages){return false}return this._getMessage(key,locale)!==null};Lang.prototype.get=function(key,replacements,locale){if(!this.has(key)){return key}var message=this._getMessage(key,locale);if(message===null){return key}if(replacements){message=this._applyReplacements(message,replacements)}return message};Lang.prototype.trans=function(key,replacements){return this.get(key,replacements)};Lang.prototype.choice=function(key,number,replacements,locale){replacements=typeof replacements!=="undefined"?replacements:{};replacements.count=number;var message=this.get(key,replacements,locale);if(message===null||message===undefined){return message}var messageParts=message.split("|");var explicitRules=[];for(var i=0;i<messageParts.length;i++){messageParts[i]=messageParts[i].trim();if(anyIntervalRegexp.test(messageParts[i])){var messageSpaceSplit=messageParts[i].split(/\s/);explicitRules.push(messageSpaceSplit.shift());messageParts[i]=messageSpaceSplit.join(" ")}}if(messageParts.length===1){return message}for(var j=0;j<explicitRules.length;j++){if(this._testInterval(number,explicitRules[j])){return messageParts[j]}}var pluralForm=this._getPluralForm(number);return messageParts[pluralForm]};Lang.prototype.transChoice=function(key,count,replacements){return this.choice(key,count,replacements)};Lang.prototype._parseKey=function(key,locale){if(typeof key!=="string"||typeof locale!=="string"){return null}var segments=key.split(".");var source=segments[0].replace(/\//g,".");return{source:locale+"."+source,sourceFallback:this.getFallback()+"."+source,entries:segments.slice(1)}};Lang.prototype._getMessage=function(key,locale){locale=locale||this.getLocale();key=this._parseKey(key,locale);if(this.messages[key.source]===undefined&&this.messages[key.sourceFallback]===undefined){return null}var message=this.messages[key.source];var entries=key.entries.slice();while(entries.length&&(message=message[entries.shift()]));if(typeof message!=="string"&&this.messages[key.sourceFallback]){message=this.messages[key.sourceFallback];entries=key.entries.slice();while(entries.length&&(message=message[entries.shift()]));}if(typeof message!=="string"){return null}return message};Lang.prototype._applyReplacements=function(message,replacements){for(var replace in replacements){message=message.replace(new RegExp(":"+replace,"gi"),function(match){var value=replacements[replace];var allCaps=match===match.toUpperCase();if(allCaps){return value.toUpperCase()}var firstCap=match===match.replace(/\w/i,function(letter){return letter.toUpperCase()});if(firstCap){return value.charAt(0).toUpperCase()+value.slice(1)}return value})}return message};Lang.prototype._testInterval=function(count,interval){if(typeof interval!=="string"){throw"Invalid interval: should be a string."}interval=interval.trim();var matches=interval.match(intervalRegexp);if(!matches){throw new"Invalid interval: "+interval}if(matches[2]){var items=matches[2].split(",");for(var i=0;i<items.length;i++){if(parseInt(items[i],10)===count){return true}}}else{matches=matches.filter(function(match){return!!match});var leftDelimiter=matches[1];var leftNumber=convertNumber(matches[2]);if(leftNumber===Infinity){leftNumber=-Infinity}var rightNumber=convertNumber(matches[3]);var rightDelimiter=matches[4];return(leftDelimiter==="["?count>=leftNumber:count>leftNumber)&&(rightDelimiter==="]"?count<=rightNumber:count<rightNumber)}return false};Lang.prototype._getPluralForm=function(count){switch(this.locale){case"az":case"bo":case"dz":case"id":case"ja":case"jv":case"ka":case"km":case"kn":case"ko":case"ms":case"th":case"tr":case"vi":case"zh":return 0;case"af":case"bn":case"bg":case"ca":case"da":case"de":case"el":case"en":case"eo":case"es":case"et":case"eu":case"fa":case"fi":case"fo":case"fur":case"fy":case"gl":case"gu":case"ha":case"he":case"hu":case"is":case"it":case"ku":case"lb":case"ml":case"mn":case"mr":case"nah":case"nb":case"ne":case"nl":case"nn":case"no":case"om":case"or":case"pa":case"pap":case"ps":case"pt":case"so":case"sq":case"sv":case"sw":case"ta":case"te":case"tk":case"ur":case"zu":return count==1?0:1;case"am":case"bh":case"fil":case"fr":case"gun":case"hi":case"hy":case"ln":case"mg":case"nso":case"xbr":case"ti":case"wa":return count===0||count===1?0:1;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return count%10==1&&count%100!=11?0:count%10>=2&&count%10<=4&&(count%100<10||count%100>=20)?1:2;case"cs":case"sk":return count==1?0:count>=2&&count<=4?1:2;case"ga":return count==1?0:count==2?1:2;case"lt":return count%10==1&&count%100!=11?0:count%10>=2&&(count%100<10||count%100>=20)?1:2;case"sl":return count%100==1?0:count%100==2?1:count%100==3||count%100==4?2:3;case"mk":return count%10==1?0:1;case"mt":return count==1?0:count===0||count%100>1&&count%100<11?1:count%100>10&&count%100<20?2:3;case"lv":return count===0?0:count%10==1&&count%100!=11?1:2;case"pl":return count==1?0:count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?1:2;case"cy":return count==1?0:count==2?1:count==8||count==11?2:3;case"ro":return count==1?0:count===0||count%100>0&&count%100<20?1:2;case"ar":return count===0?0:count==1?1:count==2?2:count%100>=3&&count%100<=10?3:count%100>=11&&count%100<=99?4:5;default:return 0}};return Lang});(function(){Lang=new Lang();Lang.setMessages({"de.auth":{"failed":"Diese Zugangsdaten wurden nicht in unserer Datenbank gefunden.","throttle":"Zu viele Loginversuche. Versuchen Sie es bitte in :seconds Sekunden nochmal."},"de.mmex":{"Deposit":"Gutschrift","Duplicate":"Duplizieren","Follow Up":"Beobachten","Reconciled":"\u00dcberpr\u00fcft","Transfer":"\u00dcbertrag","Void":"Ung\u00fcltig","Withdrawal":"Zahlung","account":"Konto","actions":"Aktionen","add":"Hinzuf\u00fcgen","add-attachment":"Mach ein Foto oder f\u00fcge Anh\u00e4nge hinzu","add-net-transaction":"Neue Bewegung hinzuf\u00fcgen","add-payee":"Hinzuf\u00fcgen","add-transaction":"Bewegung erfassen","amount":"Betrag","api-token":"Api Key","api-version":"API Version","app-version":"App Version","browse":"Browsen...","cancel":"Abbrechen","category":"Kategorie","change-in-settings":"Kann unter \"Einstellungen\" ge\u00e4ndert werden.","common":"Allgemein","created":"Erfolgreich erstellt","current-password":"Aktuelles Passwort","current-password-wrong":"Aktuelles Passwort ist falsch!","date":"Datum","delete-transaction":"Willst du diese Bewegung wirklich l\u00f6schen?","disable_status":"Status Verwaltung deaktivieren","edit":"Bewegung bearbeiten","email":"E-Mail Adresse","forgot-password":"Passwort vergessen?","login":"Login","new-password":"Neues Passwort","no-account-yet":"Noch kein Account? Zur Registrations","no-data-add-new":"Keine Daten gefunden, Willst du einen neuen hinzuf\u00fcgen?","no-data-found":"Keine Daten gefunden","none":"(Keine\/r)","notes":"Notizen","password":"Passwort","payee":"Empf\u00e4nger\/Sender","please-choose":"Bitte w\u00e4hlen","remember-me":"Angemeldet bleiben","repeat-new-password":"Neues Passwort wiederholen","save":"Speichern","settings":"Einstellungen","status":"Status","subcategory":"Unter-Kategorie","to-account":"zu Konto","transactions":"Bewegungen","type":"Typ","ui-language":"Lokalit\u00e4t","update":"\u00dcbernehmen","update-password":"Passwort \u00e4ndern","updated":"\u00c4nderungen \u00fcbernommen","use_datepicker":"Datumpicker verwenden","used-packages":"Verwendete Packete","user-infos":"Informationen","user-settings":"Benutzer-Einstellungen","webpapp-guid":"WebApp GUID"},"de.pagination":{"next":"Weiter &raquo;","previous":"&laquo; Zur\u00fcck"},"de.passwords":{"password":"Passw\u00f6rter m\u00fcssen mindestens 6 Zeichen lang sein und korrekt best\u00e4tigt werden.","reset":"Das Passwort wurde zur\u00fcckgesetzt!","sent":"Passworterinnerung wurde gesendet!","token":"Der Passwort-Wiederherstellungs-Schl\u00fcssel ist ung\u00fcltig oder abgelaufen.","user":"Es konnte leider kein Nutzer mit dieser E-Mail-Adresse gefunden werden."},"de.validation":{"accepted":":attribute muss akzeptiert werden.","active_url":":attribute ist keine g\u00fcltige Internet-Adresse.","after":":attribute muss ein Datum nach dem :date sein.","after_or_equal":":attribute muss ein Datum nach dem :date oder gleich dem :date sein.","alpha":":attribute darf nur aus Buchstaben bestehen.","alpha_dash":":attribute darf nur aus Buchstaben, Zahlen, Binde- und Unterstrichen bestehen. Umlaute (\u00e4, \u00f6, \u00fc) und Eszett (\u00df) sind nicht erlaubt.","alpha_num":":attribute darf nur aus Buchstaben und Zahlen bestehen.","array":":attribute muss ein Array sein.","attributes":{"account":"Konto","amount":"Betrag","category":"Kategorie","email":"E-Mail-Adresse","password":"Passwort","payee":"Empf\u00e4nger\/Sender","to_account":"zu Konto","transaction_date":"Datum","transaction_status":"Status","transaction_type":"Typ","username":"Benutzername"},"before":":attribute muss ein Datum vor dem :date sein.","before_or_equal":":attribute muss ein Datum vor dem :date oder gleich dem :date sein.","between":{"array":":attribute muss zwischen :min & :max Elemente haben.","file":":attribute muss zwischen :min & :max Kilobytes gro\u00df sein.","numeric":":attribute muss zwischen :min & :max liegen.","string":":attribute muss zwischen :min & :max Zeichen lang sein."},"boolean":":attribute muss entweder 'true' oder 'false' sein.","confirmed":":attribute stimmt nicht mit der Best\u00e4tigung \u00fcberein.","custom":{"attribute-name":{"rule-name":"custom-message"}},"date":":attribute muss ein g\u00fcltiges Datum sein.","date_format":":attribute entspricht nicht dem g\u00fcltigen Format f\u00fcr :format.","different":":attribute und :other m\u00fcssen sich unterscheiden.","digits":":attribute muss :digits Stellen haben.","digits_between":":attribute muss zwischen :min und :max Stellen haben.","dimensions":":attribute hat ung\u00fcltige Bildabmessungen.","distinct":"Das Feld :attribute beinhaltet einen bereits vorhandenen Wert.","email":":attribute muss eine g\u00fcltige E-Mail-Adresse sein.","exists":"Der gew\u00e4hlte Wert f\u00fcr :attribute ist ung\u00fcltig.","file":":attribute muss eine Datei sein.","filled":":attribute muss ausgef\u00fcllt sein.","image":":attribute muss ein Bild sein.","in":"Der gew\u00e4hlte Wert f\u00fcr :attribute ist ung\u00fcltig.","in_array":"Der gew\u00e4hlte Wert f\u00fcr :attribute kommt nicht in :other vor.","integer":":attribute muss eine ganze Zahl sein.","ip":":attribute muss eine g\u00fcltige IP-Adresse sein.","ipv4":":attribute muss eine g\u00fcltige IPv4-Adresse sein.","ipv6":":attribute muss eine g\u00fcltige IPv6-Adresse sein.","json":":attribute muss ein g\u00fcltiger JSON-String sein.","max":{"array":":attribute darf nicht mehr als :max Elemente haben.","file":":attribute darf maximal :max Kilobytes gro\u00df sein.","numeric":":attribute darf maximal :max sein.","string":":attribute darf maximal :max Zeichen haben."},"mimes":":attribute muss den Dateityp :values haben.","mimetypes":":attribute muss den Dateityp :values haben.","min":{"array":":attribute muss mindestens :min Elemente haben.","file":":attribute muss mindestens :min Kilobytes gro\u00df sein.","numeric":":attribute muss mindestens :min sein.","string":":attribute muss mindestens :min Zeichen lang sein."},"not_in":"Der gew\u00e4hlte Wert f\u00fcr :attribute ist ung\u00fcltig.","numeric":":attribute muss eine Zahl sein.","present":"Das Feld :attribute muss vorhanden sein.","regex":":attribute Format ist ung\u00fcltig.","required":":attribute muss ausgef\u00fcllt sein.","required_if":":attribute muss ausgef\u00fcllt sein, wenn :other :value ist.","required_unless":":attribute muss ausgef\u00fcllt sein, wenn :other nicht :values ist.","required_with":":attribute muss angegeben werden, wenn :values ausgef\u00fcllt wurde.","required_with_all":":attribute muss angegeben werden, wenn :values ausgef\u00fcllt wurde.","required_without":":attribute muss angegeben werden, wenn :values nicht ausgef\u00fcllt wurde.","required_without_all":":attribute muss angegeben werden, wenn keines der Felder :values ausgef\u00fcllt wurde.","same":":attribute und :other m\u00fcssen \u00fcbereinstimmen.","size":{"array":":attribute muss genau :size Elemente haben.","file":":attribute muss :size Kilobyte gro\u00df sein.","numeric":":attribute muss gleich :size sein.","string":":attribute muss :size Zeichen lang sein."},"string":":attribute muss ein String sein.","timezone":":attribute muss eine g\u00fcltige Zeitzone sein.","unique":":attribute ist schon vergeben.","uploaded":"Der :attribute konnte nicht hochgeladen werden.","url":"Das Format von :attribute ist ung\u00fcltig."},"en.auth":{"failed":"These credentials do not match our records.","throttle":"Too many login attempts. Please try again in :seconds seconds."},"en.mmex":{"Deposit":"Deposit","Duplicate":"Duplicate","Follow Up":"Follow Up","Reconciled":"Reconciled","Transfer":"Transfer","Void":"Void","Withdrawal":"Withdrawal","account":"Account","actions":"Actions","add":"Add","add-attachment":"Take a picture or upload attahments","add-net-transaction":"Add new Transaction","add-payee":"Add new Payee","add-transaction":"Add Transaction","amount":"Amount","api-token":"Api Key","api-version":"API Version","app-version":"App Version","browse":"Browse...","cancel":"Cancel","category":"Category","change-in-settings":"Change under \"Settings\".","common":"Common","created":"Successfully created","current-password":"Current Password","current-password-wrong":"Current Password is wrong!","date":"Date","delete-transaction":"You really wanna delete this transaction?","disable_status":"Disable status management","edit":"Edit Transaction","email":"E-Mail Address","forgot-password":"Forgot Your Password?","login":"Login","new-password":"New Password","no-account-yet":"No Account yet? Register","no-data-add-new":"No data found. Do you want to add new item?","no-data-found":"No Data found.","none":"(None)","notes":"Notes","password":"Password","payee":"Payee","please-choose":"Please choose","remember-me":"Remember Me","repeat-new-password":"Repeat new Password","save":"Save","settings":"Settings","status":"Status","subcategory":"Subcategory","to-account":"to Account","transactions":"Transactions","type":"Type","ui-language":"Locale","update":"Update","update-password":"Update Password","updated":"Changes applied","use_datepicker":"Use Datepicker","used-packages":"Used Packages","user-infos":"Information","user-settings":"User Settings","webpapp-guid":"WebApp GUID"},"en.pagination":{"next":"Next &raquo;","previous":"&laquo; Previous"},"en.passwords":{"password":"Passwords must be at least six characters and match the confirmation.","reset":"Your password has been reset!","sent":"We have e-mailed your password reset link!","token":"This password reset token is invalid.","user":"We can't find a user with that e-mail address."},"en.validation":{"accepted":"The :attribute must be accepted.","active_url":"The :attribute is not a valid URL.","after":"The :attribute must be a date after :date.","alpha":"The :attribute may only contain letters.","alpha_dash":"The :attribute may only contain letters, numbers, and dashes.","alpha_num":"The :attribute may only contain letters and numbers.","array":"The :attribute must be an array.","attributes":{"account":"Account","amount":"Amount","category":"Category","email":"E-Mail Address","password":"Password","payee":"Payee","to_account":"to Account","transaction_date":"Date","transaction_status":"Status","transaction_type":"Type","username":"Username"},"before":"The :attribute must be a date before :date.","between":{"array":"The :attribute must have between :min and :max items.","file":"The :attribute must be between :min and :max kilobytes.","numeric":"The :attribute must be between :min and :max.","string":"The :attribute must be between :min and :max characters."},"boolean":"The :attribute field must be true or false.","confirmed":"The :attribute confirmation does not match.","custom":{"attribute-name":{"rule-name":"custom-message"}},"date":"The :attribute is not a valid date.","date_format":"The :attribute does not match the format :format.","different":"The :attribute and :other must be different.","digits":"The :attribute must be :digits digits.","digits_between":"The :attribute must be between :min and :max digits.","dimensions":"The :attribute has invalid image dimensions.","distinct":"The :attribute field has a duplicate value.","email":"The :attribute must be a valid email address.","exists":"The selected :attribute is invalid.","file":"The :attribute must be a file.","filled":"The :attribute field is required.","image":"The :attribute must be an image.","in":"The selected :attribute is invalid.","in_array":"The :attribute field does not exist in :other.","integer":"The :attribute must be an integer.","ip":"The :attribute must be a valid IP address.","json":"The :attribute must be a valid JSON string.","max":{"array":"The :attribute may not have more than :max items.","file":"The :attribute may not be greater than :max kilobytes.","numeric":"The :attribute may not be greater than :max.","string":"The :attribute may not be greater than :max characters."},"mimes":"The :attribute must be a file of type: :values.","mimetypes":"The :attribute must be a file of type: :values.","min":{"array":"The :attribute must have at least :min items.","file":"The :attribute must be at least :min kilobytes.","numeric":"The :attribute must be at least :min.","string":"The :attribute must be at least :min characters."},"not_in":"The selected :attribute is invalid.","numeric":"The :attribute must be a number.","present":"The :attribute field must be present.","regex":"The :attribute format is invalid.","required":"The :attribute field is required.","required_if":"The :attribute field is required when :other is :value.","required_unless":"The :attribute field is required unless :other is in :values.","required_with":"The :attribute field is required when :values is present.","required_with_all":"The :attribute field is required when :values is present.","required_without":"The :attribute field is required when :values is not present.","required_without_all":"The :attribute field is required when none of :values are present.","same":"The :attribute and :other must match.","size":{"array":"The :attribute must contain :size items.","file":"The :attribute must be :size kilobytes.","numeric":"The :attribute must be :size.","string":"The :attribute must be :size characters."},"string":"The :attribute must be a string.","timezone":"The :attribute must be a valid zone.","unique":"The :attribute has already been taken.","uploaded":"The :attribute failed to upload.","url":"The :attribute format is invalid."}});})();