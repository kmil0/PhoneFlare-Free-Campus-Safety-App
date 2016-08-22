//Author @ccj242 - Christopher Cinq-Mars Jarvis//

angular.module('flare.services', [])
    .factory("Data", function(User, $localStorage){
	var $data = {
	    id: null
	};

$localStorage.currentbuild="2.4.2"; 

if (typeof $localStorage.emergency==='undefined'){
  $localStorage.emergency=false;
}

if (typeof $localStorage.CheckIn==='undefined'){
  $localStorage.CheckIn=false;
}

if (typeof $localStorage.activecheckin==='undefined'){
  $localStorage.CheckIn=false;
}


//--------Options
if(!$localStorage.global){

var global = {

torch:false,
audioalarm:true,
audiorec:false,
MCdisarm:false,
color:null,
campuscall:true,
edu:true,
firstlogin:true

//audioRecordingLength?
}

}else{var global=$localStorage.global};
$localStorage.global=global;

	lastview="";
	secondlastview="";
	tetherarmstate=false;
	emergencystate=false;
	DirectEmergency=false;
	ActiveEmergency=false; // deprecated? 
	TetherEmergency=false;
	CheckInEmergency=false;
	CheckinNeeded=false; // deprecated? 
  androidcheck=false;


if($localStorage.realpass){
	passcodesettingstate="authentication"
}else{passcodesettingstate="newpass"}

//----Blacklist courtsey of @ivolo and @danhstevens on Github

Blacklist=[
  "0-mail.com",
  "027168.com",
  "0815.ru",
  "0815.su",
  "0clickemail.com",
  "0wnd.net",
  "0wnd.org",
  "10mail.org",
  "10minutemail.cf",
  "10minutemail.co.za",
  "10minutemail.com",
  "10minutemail.de",
  "10minutemail.ga",
  "10minutemail.gq",
  "10minutemail.ml",
  "123-m.com",
  "12minutemail.com",
  "1ce.us",
  "1chuan.com",
  "1mail.ml",
  "1pad.de",
  "1zhuan.com",
  "2-ch.space",
  "20email.eu",
  "20mail.in",
  "20mail.it",
  "20minutemail.com",
  "21cn.com",
  "24hourmail.com",
  "2ch.coms.hk",
  "2prong.com",
  "30minutemail.com",
  "33mail.com",
  "3d-painting.com",
  "3mail.ga",
  "4mail.cf",
  "4mail.ga",
  "4warding.com",
  "4warding.net",
  "4warding.org",
  "5mail.cf",
  "5mail.ga",
  "60minutemail.com",
  "675hosting.com",
  "675hosting.net",
  "675hosting.org",
  "6ip.us",
  "6mail.cf",
  "6mail.ga",
  "6mail.ml",
  "6paq.com",
  "6url.com",
  "75hosting.com",
  "75hosting.net",
  "75hosting.org",
  "7days-printing.com",
  "7mail.ga",
  "7mail.ml",
  "7tags.com",
  "8mail.cf",
  "8mail.ga",
  "8mail.ml",
  "99experts.com",
  "9mail.cf",
  "9ox.net",
  "a-bc.net",
  "a.betr.co",
  "a45.in",
  "abusemail.de",
  "abyssmail.com",
  "ac20mail.in",
  "acentri.com",
  "advantimo.com",
  "afrobacon.com",
  "ag.us.to",
  "agedmail.com",
  "ahk.jp",
  "ajaxapp.net",
  "alivance.com",
  "amail.com",
  "amilegit.com",
  "amiri.net",
  "amiriindustries.com",
  "anappthat.com",
  "ano-mail.net",
  "anonbox.net",
  "anonymail.dk",
  "anonymbox.com",
  "anotherdomaincyka.tk",
  "antichef.com",
  "antichef.net",
  "antispam.de",
  "antonelli.usa.cc",
  "appixie.com",
  "armyspy.com",
  "art-en-ligne.pro",
  "asdasd.nl",
  "ass.pp.ua",
  "aver.com",
  "avia-tonic.fr",
  "azazazatashkent.tk",
  "azmeil.tk",
  "bareed.ws",
  "baxomale.ht.cx",
  "beddly.com",
  "beefmilk.com",
  "belastingdienst.pw",
  "big1.us",
  "bigprofessor.so",
  "bigstring.com",
  "binkmail.com",
  "bio-muesli.net",
  "bladesmail.net",
  "blogmyway.org",
  "blutig.me",
  "bobmail.info",
  "bodhi.lawlita.com",
  "bofthew.com",
  "bootybay.de",
  "boun.cr",
  "bouncr.com",
  "boxformail.in",
  "boximail.com",
  "boxtemp.com.br",
  "breadtimes.press",
  "brefmail.com",
  "brennendesreich.de",
  "broadbandninja.com",
  "bsnow.net",
  "btcmail.pw",
  "bu.mintemail.com",
  "buffemail.com",
  "bugmenot.com",
  "bumpymail.com",
  "bund.us",
  "bundes-li.ga",
  "burnthespam.info",
  "burstmail.info",
  "buyusedlibrarybooks.org",
  "byom.de",
  "c2.hu",
  "c51vsgq.com",
  "cachedot.net",
  "casualdx.com",
  "cbair.com",
  "ce.mintemail.com",
  "cellurl.com",
  "centermail.com",
  "centermail.net",
  "chacuo.net",
  "chammy.info",
  "cheatmail.de",
  "chogmail.com",
  "choicemail1.com",
  "chong-mail.com",
  "chong-mail.net",
  "chong-mail.org",
  "ckaazaza.tk",
  "clixser.com",
  "clrmail.com",
  "cmail.com",
  "cmail.net",
  "cmail.org",
  "cnn.coms.hk",
  "coldemail.info",
  "consumerriot.com",
  "cool.fr.nf",
  "correo.blogos.net",
  "cosmorph.com",
  "courriel.fr.nf",
  "courrieltemporaire.com",
  "crapmail.org",
  "crazespaces.pw",
  "crazymailing.com",
  "cubiclink.com",
  "curryworld.de",
  "cust.in",
  "cuvox.de",
  "cx.de-a.org",
  "cyber-innovation.club",
  "cyber-phone.eu",
  "dacoolest.com",
  "daintly.com",
  "dandikmail.com",
  "dasdasdascyka.tk",
  "dayrep.com",
  "dbunker.com",
  "dcemail.com",
  "deadaddress.com",
  "deadchildren.org",
  "deadfake.cf",
  "deadfake.ga",
  "deadfake.ml",
  "deadfake.tk",
  "deadspam.com",
  "deagot.com",
  "dealja.com",
  "despam.it",
  "despammed.com",
  "devnullmail.com",
  "dfgh.net",
  "dfghj.ml",
  "dharmatel.net",
  "digitalsanctuary.com",
  "dingbone.com",
  "discard.cf",
  "discard.email",
  "discard.ga",
  "discard.gq",
  "discard.ml",
  "discard.tk",
  "discardmail.com",
  "discardmail.de",
  "disign-concept.eu",
  "disign-revelation.com",
  "dispomail.eu",
  "disposable-email.ml",
  "disposable.cf",
  "disposable.ga",
  "disposable.ml",
  "disposableaddress.com",
  "disposableemailaddresses.com",
  "disposableemailaddresses.emailmiser.com",
  "disposableinbox.com",
  "dispose.it",
  "disposeamail.com",
  "disposemail.com",
  "dispostable.com",
  "divermail.com",
  "divismail.ru",
  "dlemail.ru",
  "dm.w3internet.co.uk",
  "dodgeit.com",
  "dodgit.com",
  "dodgit.org",
  "dodsi.com",
  "doiea.com",
  "domforfb1.tk",
  "domforfb2.tk",
  "domforfb3.tk",
  "domforfb4.tk",
  "domforfb5.tk",
  "domforfb6.tk",
  "domforfb7.tk",
  "domforfb8.tk",
  "domforfb9.tk",
  "domozmail.com",
  "donemail.ru",
  "dontreg.com",
  "dontsendmespam.de",
  "dotmsg.com",
  "drdrb.com",
  "drdrb.net",
  "droplar.com",
  "dropmail.me",
  "duam.net",
  "dudmail.com",
  "dump-email.info",
  "dumpandjunk.com",
  "dumpmail.de",
  "dumpyemail.com",
  "duskmail.com",
  "dw.now.im",
  "dx.abuser.eu",
  "dx.allowed.org",
  "dx.awiki.org",
  "dx.ez.lv",
  "dx.sly.io",
  "e-mail.com",
  "e-mail.org",
  "e4ward.com",
  "easytrashmail.com",
  "ecolo-online.fr",
  "ee2.pl",
  "eelmail.com",
  "einrot.com",
  "einrot.de",
  "email-fake.cf",
  "email-fake.ga",
  "email-fake.gq",
  "email-fake.ml",
  "email-fake.tk",
  "email.cbes.net",
  "email60.com",
  "emailage.cf",
  "emailage.ga",
  "emailage.gq",
  "emailage.ml",
  "emailage.tk",
  "emaildienst.de",
  "emailgo.de",
  "emailias.com",
  "emailigo.de",
  "emailinfive.com",
  "emailisvalid.com",
  "emaillime.com",
  "emailmiser.com",
  "emailproxsy.com",
  "emails.ga",
  "emailsensei.com",
  "emailspam.cf",
  "emailspam.ga",
  "emailspam.gq",
  "emailspam.ml",
  "emailspam.tk",
  "emailtemporar.ro",
  "emailtemporario.com.br",
  "emailthe.net",
  "emailtmp.com",
  "emailto.de",
  "emailwarden.com",
  "emailx.at.hm",
  "emailxfer.com",
  "emailz.cf",
  "emailz.ga",
  "emailz.gq",
  "emailz.ml",
  "emeil.in",
  "emeil.ir",
  "emil.com",
  "emkei.cf",
  "emkei.ga",
  "emkei.gq",
  "emkei.ml",
  "emkei.tk",
  "eml.pp.ua",
  "emz.net",
  "enterto.com",
  "ephemail.net",
  "est.une.victime.ninja",
  "etranquil.com",
  "etranquil.net",
  "etranquil.org",
  "everytg.ml",
  "evopo.com",
  "explodemail.com",
  "eyepaste.com",
  "facebook-email.cf",
  "facebook-email.ga",
  "facebook-email.ml",
  "facebookmail.gq",
  "facebookmail.ml",
  "fake-email.pp.ua",
  "fake-mail.cf",
  "fake-mail.ga",
  "fake-mail.ml",
  "fakeinbox.cf",
  "fakeinbox.com",
  "fakeinbox.ga",
  "fakeinbox.ml",
  "fakeinbox.tk",
  "fakeinformation.com",
  "fakemail.fr",
  "fakemailgenerator.com",
  "fakemailz.com",
  "fammix.com",
  "fansworldwide.de",
  "fantasymail.de",
  "fast-mail.fr",
  "fastacura.com",
  "fastchevy.com",
  "fastchrysler.com",
  "fastkawasaki.com",
  "fastmazda.com",
  "fastmitsubishi.com",
  "fastnissan.com",
  "fastsubaru.com",
  "fastsuzuki.com",
  "fasttoyota.com",
  "fastyamaha.com",
  "fatflap.com",
  "fbi.coms.hk",
  "fdfdsfds.com",
  "ficken.de",
  "fightallspam.com",
  "fiifke.de",
  "filzmail.com",
  "fixmail.tk",
  "fizmail.com",
  "fleckens.hu",
  "flemail.ru",
  "flurred.com",
  "flyspam.com",
  "footard.com",
  "forgetmail.com",
  "fornow.eu",
  "fr33mail.info",
  "fragolina2.tk",
  "frapmail.com",
  "frappina.tk",
  "frappina99.tk",
  "free-email.cf",
  "free-email.ga",
  "freelance-france.eu",
  "freemail.ms",
  "freemails.cf",
  "freemails.ga",
  "freemails.ml",
  "freemeil.ga",
  "freemeil.gq",
  "freemeil.ml",
  "freundin.ru",
  "friendlymail.co.uk",
  "front14.org",
  "fuckingduh.com",
  "fudgerub.com",
  "fux0ringduh.com",
  "fw.moza.pl",
  "g.hmail.us",
  "garliclife.com",
  "gawab.com",
  "gelitik.in",
  "get-mail.cf",
  "get-mail.ga",
  "get-mail.ml",
  "get-mail.tk",
  "get.pp.ua",
  "get1mail.com",
  "get2mail.fr",
  "getairmail.cf",
  "getairmail.com",
  "getairmail.ga",
  "getairmail.gq",
  "getairmail.ml",
  "getairmail.tk",
  "getmails.eu",
  "getonemail.com",
  "getonemail.net",
  "ghosttexter.de",
  "girlsundertheinfluence.com",
  "gishpuppy.com",
  "go.irc.so",
  "goemailgo.com",
  "gorillaswithdirtyarmpits.com",
  "gotmail.com",
  "gotmail.net",
  "gotmail.org",
  "gotti.otherinbox.com",
  "gowikibooks.com",
  "gowikicampus.com",
  "gowikicars.com",
  "gowikifilms.com",
  "gowikigames.com",
  "gowikimusic.com",
  "gowikinetwork.com",
  "gowikitravel.com",
  "gowikitv.com",
  "grandmamail.com",
  "grandmasmail.com",
  "great-host.in",
  "greensloth.com",
  "grr.la",
  "gsrv.co.uk",
  "guerillamail.biz",
  "guerillamail.com",
  "guerillamail.net",
  "guerillamail.org",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "gustr.com",
  "h.mintemail.com",
  "h8s.org",
  "hacccc.com",
  "haltospam.com",
  "harakirimail.com",
  "hartbot.de",
  "hatespam.org",
  "hellodream.mobi",
  "herp.in",
  "hidemail.de",
  "hidzz.com",
  "hmamail.com",
  "hochsitze.com",
  "hoer.pw",
  "hopemail.biz",
  "hot-mail.cf",
  "hot-mail.ga",
  "hot-mail.gq",
  "hot-mail.ml",
  "hot-mail.tk",
  "hotpop.com",
  "hulapla.de",
  "humn.ws.gy",
  "i2pmail.org",
  "ieatspam.eu",
  "ieatspam.info",
  "ieh-mail.de",
  "ihateyoualot.info",
  "iheartspam.org",
  "ikbenspamvrij.nl",
  "imails.info",
  "imgof.com",
  "imgv.de",
  "immo-gerance.info",
  "imstations.com",
  "inbax.tk",
  "inbound.plus",
  "inbox.si",
  "inboxalias.com",
  "inboxclean.com",
  "inboxclean.org",
  "inboxproxy.com",
  "incognitomail.com",
  "incognitomail.net",
  "incognitomail.org",
  "info-radio.ml",
  "inmynetwork.tk",
  "insorg-mail.info",
  "instant-mail.de",
  "instantemailaddress.com",
  "instantmail.fr",
  "ip4.pp.ua",
  "ip6.pp.ua",
  "ipoo.org",
  "irish2me.com",
  "iroid.com",
  "iwi.net",
  "je-recycle.info",
  "jet-renovation.fr",
  "jetable.com",
  "jetable.fr.nf",
  "jetable.net",
  "jetable.org",
  "jnxjn.com",
  "jobbikszimpatizans.hu",
  "jourrapide.com",
  "jp.ftp.sh",
  "jsrsolutions.com",
  "junk1e.com",
  "junkmail.ga",
  "junkmail.gq",
  "kanker.website",
  "kasmail.com",
  "kaspop.com",
  "keepmymail.com",
  "keinpardon.de",
  "killmail.com",
  "killmail.net",
  "kimsdisk.com",
  "kingsq.ga",
  "kir.ch.tc",
  "klassmaster.com",
  "klassmaster.net",
  "klzlk.com",
  "knol-power.nl",
  "kook.ml",
  "koszmail.pl",
  "kulturbetrieb.info",
  "kurzepost.de",
  "l33r.eu",
  "labetteraverouge.at",
  "lackmail.net",
  "lackmail.ru",
  "lags.us",
  "landmail.co",
  "laoeq.com",
  "last-chance.pro",
  "lastmail.co",
  "lastmail.com",
  "lazyinbox.com",
  "legalrc.loan",
  "letthemeatspam.com",
  "lhsdv.com",
  "lifebyfood.com",
  "link2mail.net",
  "litedrop.com",
  "liveradio.tk",
  "loadby.us",
  "login-email.cf",
  "login-email.ga",
  "login-email.ml",
  "login-email.tk",
  "loh.pp.ua",
  "lol.ovpn.to",
  "lolfreak.net",
  "lolito.tk",
  "lookugly.com",
  "lopl.co.cc",
  "lortemail.dk",
  "lovefall.ml",
  "lovemeleaveme.com",
  "lovesea.gq",
  "lr7.us",
  "lr78.com",
  "lroid.com",
  "luv2.us",
  "m.ddcrew.com",
  "m4ilweb.info",
  "maboard.com",
  "mail-easy.fr",
  "mail-filter.com",
  "mail-temporaire.fr",
  "mail.by",
  "mail.mezimages.net",
  "mail114.net",
  "mail2rss.org",
  "mail333.com",
  "mail4trash.com",
  "mailbidon.com",
  "mailblocks.com",
  "mailbox72.biz",
  "mailbox80.biz",
  "mailbucket.org",
  "mailcat.biz",
  "mailcatch.com",
  "maildrop.cc",
  "maildrop.cf",
  "maildrop.ga",
  "maildrop.gq",
  "maildrop.ml",
  "maildx.com",
  "maileater.com",
  "mailed.ro",
  "mailexpire.com",
  "mailfa.tk",
  "mailforspam.com",
  "mailfree.ga",
  "mailfree.gq",
  "mailfree.ml",
  "mailfreeonline.com",
  "mailfs.com",
  "mailguard.me",
  "mailimate.com",
  "mailin8r.com",
  "mailinatar.com",
  "mailinater.com",
  "mailinator.com",
  "mailinator.gq",
  "mailinator.net",
  "mailinator.org",
  "mailinator.us",
  "mailinator2.com",
  "mailincubator.com",
  "mailismagic.com",
  "mailjunk.cf",
  "mailjunk.ga",
  "mailjunk.gq",
  "mailjunk.ml",
  "mailjunk.tk",
  "mailmate.com",
  "mailme.gq",
  "mailme.ir",
  "mailme.lv",
  "mailme24.com",
  "mailmetrash.com",
  "mailmoat.com",
  "mailnator.com",
  "mailnesia.com",
  "mailnull.com",
  "mailpick.biz",
  "mailproxsy.com",
  "mailquack.com",
  "mailrock.biz",
  "mailsac.com",
  "mailscrap.com",
  "mailseal.de",
  "mailshell.com",
  "mailsiphon.com",
  "mailslapping.com",
  "mailslite.com",
  "mailspam.usa.cc",
  "mailtemp.info",
  "mailtothis.com",
  "mailzi.ru",
  "mailzilla.com",
  "mailzilla.org",
  "mailzilla.orgmbx.cc",
  "makemetheking.com",
  "manifestgenerator.com",
  "manybrain.com",
  "mbx.cc",
  "mciek.com",
  "mega.zik.dj",
  "meinspamschutz.de",
  "meltmail.com",
  "merda.flu.cc",
  "merda.igg.biz",
  "merda.nut.cc",
  "merda.usa.cc",
  "messagebeamer.de",
  "mezimages.net",
  "mfsa.ru",
  "mierdamail.com",
  "migmail.net",
  "migmail.pl",
  "migumail.com",
  "mintemail.com",
  "mjukglass.nu",
  "moakt.com",
  "mobi.web.id",
  "mobileninja.co.uk",
  "moburl.com",
  "mohmal.com",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",
  "monumentmail.com",
  "mor19.uu.gl",
  "ms9.mailslite.com",
  "msa.minsmail.com",
  "mt2009.com",
  "mt2014.com",
  "mt2015.com",
  "mt2016.com",
  "mt2017.com",
  "muehlacker.tk",
  "mx0.wwwnew.eu",
  "my.efxs.ca",
  "my10minutemail.com",
  "mycleaninbox.net",
  "myemailboxy.com",
  "mymail-in.net",
  "mymailoasis.com",
  "mynetstore.de",
  "mypacks.net",
  "mypartyclip.de",
  "myphantomemail.com",
  "myspaceinc.com",
  "myspaceinc.net",
  "myspaceinc.org",
  "myspacepimpedup.com",
  "myspamless.com",
  "mytemp.email",
  "mytempemail.com",
  "mytrashmail.com",
  "neomailbox.com",
  "nepwk.com",
  "nervmich.net",
  "nervtmich.net",
  "netmails.com",
  "netmails.net",
  "netzidiot.de",
  "neverbox.com",
  "nice-4u.com",
  "nike.coms.hk",
  "nmail.cf",
  "no-spam.ws",
  "nobulk.com",
  "noclickemail.com",
  "nogmailspam.info",
  "nomail.xl.cx",
  "nomail2me.com",
  "nomorespamemails.com",
  "nonspam.eu",
  "nonspammer.de",
  "noref.in",
  "nospam.wins.com.br",
  "nospam.ze.tc",
  "nospam4.us",
  "nospamfor.us",
  "nospamthanks.info",
  "notmailinator.com",
  "notsharingmy.info",
  "nowhere.org",
  "nowmymail.com",
  "ntlhelp.net",
  "nurfuerspam.de",
  "nus.edu.sg",
  "nwldx.com",
  "objectmail.com",
  "obobbo.com",
  "odaymail.com",
  "olypmall.ru",
  "one-time.email",
  "oneoffemail.com",
  "oneoffmail.com",
  "onewaymail.com",
  "online.ms",
  "oopi.org",
  "opayq.com",
  "ordinaryamerican.net",
  "oshietechan.link",
  "otherinbox.com",
  "ourklips.com",
  "outlawspam.com",
  "ovpn.to",
  "owlpic.com",
  "pancakemail.com",
  "paplease.com",
  "pcusers.otherinbox.com",
  "pepbot.com",
  "pepsi.coms.hk",
  "pfui.ru",
  "photo-impact.eu",
  "phpbb.uu.gl",
  "pimpedupmyspace.com",
  "pjjkp.com",
  "plexolan.de",
  "po.bot.nu",
  "poh.pp.ua",
  "politikerclub.de",
  "poofy.org",
  "pookmail.com",
  "postacin.com",
  "premium-mail.fr",
  "privacy.net",
  "privy-mail.com",
  "privymail.de",
  "project-xhabbo.com",
  "proxymail.eu",
  "prtnx.com",
  "prtz.eu",
  "punkass.com",
  "puttanamaiala.tk",
  "putthisinyourspamdatabase.com",
  "pwrby.com",
  "qasti.com",
  "qisdo.com",
  "qisoa.com",
  "qs.dp76.com",
  "quickinbox.com",
  "quickmail.nl",
  "radiku.ye.vc",
  "rcpt.at",
  "reality-concept.club",
  "reallymymail.com",
  "receiveee.chickenkiller.com",
  "receiveee.com",
  "recode.me",
  "reconmail.com",
  "recursor.net",
  "recyclemail.dk",
  "regbypass.com",
  "regbypass.comsafe-mail.net",
  "regspaces.tk",
  "rejectmail.com",
  "remail.cf",
  "remail.ga",
  "resgedvgfed.tk",
  "rhyta.com",
  "rk9.chickenkiller.com",
  "rklips.com",
  "rmqkr.net",
  "royal.net",
  "rppkn.com",
  "rtrtr.com",
  "ruffrey.com",
  "rx.dred.ru",
  "rx.qc.to",
  "s.spamserver.flu.cc",
  "s0ny.net",
  "safe-mail.net",
  "safersignup.de",
  "safetymail.info",
  "safetypost.de",
  "sandelf.de",
  "savelife.ml",
  "saynotospams.com",
  "scatmail.com",
  "schafmail.de",
  "secure-mail.biz",
  "secure-mail.cc",
  "selfdestructingmail.com",
  "selfdestructingmail.org",
  "sendspamhere.com",
  "servermaps.net",
  "sharedmailbox.org",
  "sharklasers.com",
  "shieldedmail.com",
  "shiftmail.com",
  "shitmail.de",
  "shitmail.me",
  "shitmail.org",
  "shitware.nl",
  "shortmail.net",
  "shotmail.ru",
  "showslow.de",
  "sibmail.com",
  "sinnlos-mail.de",
  "siteposter.net",
  "skeefmail.com",
  "skrx.tk",
  "slaskpost.se",
  "slave-auctions.net",
  "slippery.email",
  "slipry.net",
  "slopsbox.com",
  "slushmail.com",
  "smashmail.de",
  "smellfear.com",
  "smellrear.com",
  "snakemail.com",
  "sneakemail.com",
  "snkmail.com",
  "sofimail.com",
  "sofort-mail.de",
  "softpls.asia",
  "sogetthis.com",
  "sohu.com",
  "soisz.com",
  "solar-impact.pro",
  "solvemail.info",
  "soodomail.com",
  "soodonims.com",
  "spam-be-gone.com",
  "spam.la",
  "spam.su",
  "spam4.me",
  "spamavert.com",
  "spambob.com",
  "spambob.net",
  "spambob.org",
  "spambog.com",
  "spambog.de",
  "spambog.net",
  "spambog.ru",
  "spambooger.com",
  "spambox.info",
  "spambox.irishspringrealty.com",
  "spambox.us",
  "spamcannon.com",
  "spamcannon.net",
  "spamcero.com",
  "spamcon.org",
  "spamcorptastic.com",
  "spamcowboy.com",
  "spamcowboy.net",
  "spamcowboy.org",
  "spamday.com",
  "spamdecoy.net",
  "spamex.com",
  "spamfighter.cf",
  "spamfighter.ga",
  "spamfighter.gq",
  "spamfighter.ml",
  "spamfighter.tk",
  "spamfree.eu",
  "spamfree24.com",
  "spamfree24.de",
  "spamfree24.eu",
  "spamfree24.info",
  "spamfree24.net",
  "spamfree24.org",
  "spamgoes.in",
  "spamgourmet.com",
  "spamgourmet.net",
  "spamgourmet.org",
  "spamherelots.com",
  "spamhereplease.com",
  "spamhole.com",
  "spamify.com",
  "spaminator.de",
  "spamkill.info",
  "spaml.com",
  "spaml.de",
  "spammotel.com",
  "spamobox.com",
  "spamoff.de",
  "spamsalad.in",
  "spamserver.flu.cc",
  "spamslicer.com",
  "spamspot.com",
  "spamstack.net",
  "spamthis.co.uk",
  "spamthisplease.com",
  "spamtrail.com",
  "spamtroll.net",
  "speed.1s.fr",
  "sperma.cf",
  "spikio.com",
  "spoofmail.de",
  "spybox.de",
  "squizzy.de",
  "sr.ro.lt",
  "sraka.xyz",
  "ss.undo.it",
  "ssoia.com",
  "startkeys.com",
  "stinkefinger.net",
  "stop-my-spam.cf",
  "stop-my-spam.com",
  "stop-my-spam.ga",
  "stop-my-spam.ml",
  "stop-my-spam.tk",
  "streetwisemail.com",
  "stuffmail.de",
  "sudolife.me",
  "sudolife.net",
  "sudomail.biz",
  "sudomail.com",
  "sudomail.net",
  "sudoverse.com",
  "sudoverse.net",
  "sudoweb.net",
  "sudoworld.com",
  "sudoworld.net",
  "supergreatmail.com",
  "supermailer.jp",
  "superrito.com",
  "superstachel.de",
  "suremail.info",
  "susi.ml",
  "svk.jp",
  "sweetxxx.de",
  "t.psh.me",
  "tafmail.com",
  "tagyourself.com",
  "talkinator.com",
  "tapchicuoihoi.com",
  "tarzan.usa.cc",
  "tarzanmail.cf",
  "tarzanmail.ml",
  "teewars.org",
  "teleworm.com",
  "teleworm.us",
  "temp-mail.com",
  "temp-mail.de",
  "temp-mail.org",
  "temp.bartdevos.be",
  "temp.emeraldwebmail.com",
  "temp.headstrong.de",
  "tempail.com",
  "tempalias.com",
  "tempe-mail.com",
  "tempemail.biz",
  "tempemail.co.za",
  "tempemail.com",
  "tempemail.net",
  "tempinbox.co.uk",
  "tempinbox.com",
  "tempmail.co",
  "tempmail.it",
  "tempmail2.com",
  "tempmaildemo.com",
  "tempmailer.com",
  "tempomail.fr",
  "temporarily.de",
  "temporarioemail.com.br",
  "temporaryemail.net",
  "temporaryemail.us",
  "temporaryforwarding.com",
  "temporaryinbox.com",
  "tempsky.com",
  "tempthe.net",
  "tempymail.com",
  "thanksnospam.info",
  "thankyou2010.com",
  "thecloudindex.com",
  "thisisnotmyrealemail.com",
  "thraml.com",
  "thrma.com",
  "throam.com",
  "thrott.com",
  "throwam.com",
  "throwawayemailaddress.com",
  "throwawaymail.com",
  "tilien.com",
  "tittbit.in",
  "tmail.ws",
  "tmailinator.com",
  "toiea.com",
  "toomail.biz",
  "tradermail.info",
  "trash-amil.com",
  "trash-mail.at",
  "trash-mail.cf",
  "trash-mail.com",
  "trash-mail.de",
  "trash-mail.ga",
  "trash-mail.gq",
  "trash-mail.ml",
  "trash-mail.tk",
  "trash2009.com",
  "trash2010.com",
  "trash2011.com",
  "trashdevil.com",
  "trashdevil.de",
  "trashemail.de",
  "trashmail.at",
  "trashmail.com",
  "trashmail.de",
  "trashmail.me",
  "trashmail.net",
  "trashmail.org",
  "trashmail.ws",
  "trashmailer.com",
  "trashymail.com",
  "trashymail.net",
  "trayna.com",
  "trbvm.com",
  "trbvn.com",
  "trbvo.com",
  "trickmail.net",
  "trillianpro.com",
  "tryalert.com",
  "turoid.com",
  "turual.com",
  "twinmail.de",
  "twoweirdtricks.com",
  "ty.ceed.se",
  "tyldd.com",
  "u14269.ml",
  "ubismail.net",
  "uggsrock.com",
  "umail.net",
  "unmail.ru",
  "upliftnow.com",
  "uplipht.com",
  "uroid.com",
  "used-product.fr",
  "username.e4ward.com",
  "ux.dob.jp",
  "ux.uk.to",
  "vaasfc4.tk",
  "valemail.net",
  "venompen.com",
  "veryrealemail.com",
  "vfemail.net",
  "vickaentb.tk",
  "vidchart.com",
  "viditag.com",
  "viewcastmedia.com",
  "viewcastmedia.net",
  "viewcastmedia.org",
  "visa.coms.hk",
  "vkcode.ru",
  "vomoto.com",
  "vp.ycare.de",
  "vubby.com",
  "walala.org",
  "walkmail.net",
  "walkmail.ru",
  "wazabi.club",
  "we.qq.my",
  "web-contact.info",
  "web-emailbox.eu",
  "web-ideal.fr",
  "webcontact-france.eu",
  "webemail.me",
  "webm4il.info",
  "webuser.in",
  "wee.my",
  "wefjo.grn.cc",
  "weg-werf-email.de",
  "wegwerf-email-addressen.de",
  "wegwerf-emails.de",
  "wegwerfadresse.de",
  "wegwerfemail.de",
  "wegwerfmail.de",
  "wegwerfmail.info",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "wegwerpmailadres.nl",
  "wetrainbayarea.com",
  "wetrainbayarea.org",
  "wfgdfhj.tk",
  "wh4f.org",
  "whatiaas.com",
  "whatpaas.com",
  "whatsaas.com",
  "whopy.com",
  "whtjddn.33mail.com",
  "whyspam.me",
  "wickmail.net",
  "wilemail.com",
  "willselfdestruct.com",
  "winemaven.info",
  "wmail.cf",
  "wollan.info",
  "wovz.cu.cc",
  "wr.moeri.org",
  "wronghead.com",
  "wuzup.net",
  "wuzupmail.net",
  "www.e4ward.com",
  "www.gishpuppy.com",
  "www.mailinator.com",
  "wwwnew.eu",
  "xagloo.com",
  "xemaps.com",
  "xents.com",
  "xing886.uu.gl",
  "xmaily.com",
  "xoxox.cc",
  "xoxy.net",
  "xww.ro",
  "xy9ce.tk",
  "xyzfree.net",
  "yapped.net",
  "yeah.net",
  "yep.it",
  "yert.ye.vc",
  "yogamaven.com",
  "yomail.info",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.gq",
  "yopmail.net",
  "youmail.ga",
  "ypmail.webarnak.fr.eu.org",
  "yuurok.com",
  "z1p.biz",
  "za.com",
  "zaktouni.fr",
  "ze.gally.jp",
  "zehnminutenmail.de",
  "zeta-telecom.com",
  "zetmail.com",
  "zippymail.info",
  "zoaxe.com",
  "zoemail.com",
  "zoemail.net",
  "zoemail.org",
  "zomg.info",
  "zxcv.com",
  "zxcvbnm.com",
  "zzz.com"
];

//-----------------------------------------------------

	return {
		global: function(){
			return global;
		},
	    set: function($key, $value){
		$data[$key] = $value;
		return true;
	    },
	    get: function($key){
		return $data[$key];
	    },
	    clear: function(){
	   	$data = {};
	    },
	    deescalate_emergency: function(){
		User.deescalate_emergency({
		    id: $data.id});
		//navigator.geolocation.clearWatch(function(rez){alert('cleared'+rez)},function(rez){alert('not cleared'+rez)})
	    },
	    
	    // Global Emergency Function
	    alert_emergency: function(campus,type){
navigator.geolocation.getCurrentPosition(function($position){
  User.alert_emergency({
			id: $data.id}, {  
			    longitude: $position.coords.longitude,
			    latitude: $position.coords.latitude,
			    should_call:campus,
			    emergency_type:type
			},
					 function($response){
					     // success callback, empty     
					 },function($error){

           if ($error.status==409){
              deescalateLocally(); 

              }else if($error.status!==-1){
                globalerror($error,new Error().stack,'could not alert server','An error report has been created on this issue',true);
              } 
					}); // wait till next time you can connect?
	    
		}, function($error){
				 //globalerror($error,new Error().stack,'Could Not access <b>GPS</b> on device','An error report has been created, this <b>should</b> not affect your contacts being notified',true);     
		    User.alert_emergency({
			id: $data.id}, {
			    longitude: null,
			    latitude: null,
			    should_call:campus,
			    emergency_type:type
			},
					 function($response){
					 	   // success callback, empty     
					 },function($error){

           if ($error.status==409){
              deescalateLocally(); 

              }else if($error.status!==-1){
                globalerror($error,new Error().stack,'could not alert server','An error report has been created on this issue',true);
              } 

					 });
		},{timeout: 11000, enableHighAccuracy: true}); //&&&
		

	    }
	}
    })

    .factory('alarms', function(User, Data, $localStorage) {
	var alarms = [];
	if ($localStorage.alarms) {alarms=$localStorage.alarms};
	
	return {
	    all: function() {
		return alarms;
	    },
	    
	    add: function(data){
		alarms.push(data);
	    },
	    update: function(alarmId,key,value){
		for (var i = 0; i < alarms.length; i++) {
		    if (alarms[i].id === parseInt(alarmsId)) {
			alarms[i][key]=value;
		    }
		}
	    },
	    removeindex: function(alarm) {
		alarms.splice(alarm, 1);
		$localStorage.alarms=alarms;
	    },
	    remove: function(alarm) {
		alarms.splice(alarms.indexOf(alarm), 1);
		$localStorage.alarms=alarms;
	    },
	    clear: function(){
	   	$alarms = [];
	    },
	    get: function(alarmId) {
		for (var i = 0; i < alarms.length; i++) {
		    if (alarms[i].id === parseInt(alarmsId)) {
			return alarms[i];
		    }
		}
		return null;
	    }
	};
    })


    .factory('contacts', function(User, Data, $localStorage,$state,$ionicLoading,$ionicPopup) {

contactsinit=function(){
nocontacts(false);
contacts=[];


  $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });


		User.contacts({id: Data.get("id"),
		       filter: {where: {active: true}}})
	    .$promise
	    .then(function($find_success){

$ionicLoading.hide();

	angular.forEach($find_success, function($value, $key){

		contacts.push($value);
		iscontactsglobal(true);
	//if ($key==$find_success.length-1){iscontactsglobal(true);}

});
//----------- deprecated? ---------------
for (d = 0; d < contacts.length ; d++){
if (contacts[d].photo !== "img/empty_avatar.png"){
test = new Image();
test.src = contacts[d].photo;
if (test.height==0){contacts[d].photo="img/empty_avatar.png"}
//---------------------------------------
}

}

if (contacts.length>0){
	nocontacts(false);
$localStorage.contacts=contacts;
return;
}else{
	nocontacts(true);
	if ($localStorage.contacts){
		delete $localStorage.contacts;
		return;

	}}

	    }, function($error){
$ionicLoading.hide();
	if ($error.status==404) {

		if ($localStorage.contacts){
		contacts=$localStorage.contacts;

		if (contacts){if(contacts.length>0){nocontacts(false);$scope.iscontactsglobal(true)}}

		}else{contacts=[];}
		}else if ($error.status==401) {

		if ($state.current.url=='/login'){return}

  var alertPopup = $ionicPopup.alert({
     title: 'Login<b>Required</b>',
     subTitle: 'You are required to re-login',
     buttons: [
      {
        text: '<b>OK</b>',
        type: 'button-positive',
        onTap: function() {
          $state.go("login");
        }
      }
    ]
   });
		}else if ($error.status!==-1){
globalerror($error,new Error().stack,'Problem Fetching Contacts from Server','An error report has been created on this issue',true);

		}	
	    });

}

contactsinit();

	return {
	    all: function() {
		return contacts;
	    },
	    add:function(name,number,photo){
		contacts.push({name:name,phone:number,photo:photo})
	    },
	    remove: function(contact) {
		contacts.splice(contacts.indexOf(contact), 1);
	    },
	    get: function(contactId) {
		for (var i = 0; i < contacts.length; i++) {
		    if (contacts[i].id === parseInt(contactId)) {
			return contacts[i];
		    }
		}
		return null;
	    }
	};
    });