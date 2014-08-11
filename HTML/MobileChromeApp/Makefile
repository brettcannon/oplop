APP = Oplop
APP_COPY = app_copy

$(APP)/plugins/com.verso.cordova.clipboard: $(APP)
	cd $(APP) && cca plugin add `basename $@`

$(APP)/platforms/ios/Oplop/Resources/splash: splash
	rm -rf $@ && cd `dirname $@` && ln -s ../../../../../$<

$(APP): $(APP_COPY)
	cca create $(APP) --ios --android --copy-from=$<

$(APP_COPY)/manifest.mobile.json: ../ChromeApp/manifest.mobile.json
	cp $< $@

$(APP_COPY): ../oplop-chrome_app.zip
	unzip $< -d $@
	cp impl.js $@

clean:
	rm -rf $(APP) $(APP_COPY)

.PHONY: all
all: $(APP_COPY) $(APP_COPY)/manifest.mobile.json $(APP) $(APP)/www/impl.js $(APP)/platforms/ios/Oplop/Resources/splash $(APP)/plugins/com.verso.cordova.clipboard
