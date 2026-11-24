// Interface text in English (en) and Tamil (ta). Tamil science terms follow the textbook glossary where available.
let LANG = 'ta';
try{ const s = localStorage.getItem('g11-lang'); if(['ta', 'en'].includes(s)) LANG = s; }catch(e){}
const T = (en, ta) => ({ en, ta }[LANG]);
const UI = {
  en: {
    'app.tag': 'Grade 11 Science, Part I: interactive practical activities',
    'lib.h': 'Practical activities', 'lib.lead': 'Grade 11 Science, Part I: all 46 activities in the textbook, with page numbers. Open one to teach it, and use the virtual lab to show what really happens.',
    'f.unit': 'Unit', 'f.all': 'All', 'f.lab': 'Virtual lab only', 'f.search': 'Search activities…', 'f.none': 'No activities match.', 'f.count': '{n} activities',
    'a.act': 'Activity', 'a.page': 'Page', 'a.virtual': 'Virtual lab', 'a.goal': 'Try this', 'a.nolab': 'No virtual lab for this activity yet. Use the textbook page.', 'a.chk': 'Short description to be confirmed against the textbook.',
    'k.lab': 'Experiment', 'k.obs': 'Observation', 'k.model': 'Model', 'k.disc': 'Discussion',
    'p.back': '← All activities', 'p.present': 'Teach mode', 'p.exit': 'Exit teach mode', 'p.print': 'Print',
    'r.title': 'Textbook page', 'r.src.ta': 'Tamil-medium book, checked against the printed page numbers', 'r.en.fallback': 'English-medium page not added yet. Showing the Tamil-medium page.', 'r.none': 'No page number added yet',
    'r.help': 'Open your own textbook and enter the page numbers. They are saved on this device. Use Copy to share them through GitHub.', 'r.edit': 'Add or change the page number',
    'r.book': 'Textbook title', 'r.edition': 'Edition / year', 'r.pages': 'Activity page', 'r.extra': 'Extra pages', 'r.chk': 'I checked this in the textbook',
    'r.save': 'Save on this device', 'r.copy': 'Copy for GitHub', 'r.saved': 'Saved on this device.', 'r.copied': 'Copied. Paste it into data/refs.js and open a pull request.', 'r.copyfail': 'Copy was blocked by the browser.', 'r.verified': 'Verified', 'r.unverified': 'Not verified',
    'm.ta': 'Tamil medium', 'm.en': 'English medium', 'notfound': 'Activity not found.', 'about.link': 'About & help', 'about.h': 'About this project',
    'about.p1': 'Lab Guide G11 helps teachers explain the practical activities of the Grade 11 Science textbook. Each activity shows its page number, and many have an interactive virtual lab you can project in class.',
    'about.p2': 'The page numbers come from the Part I Tamil-medium textbook and mark where each activity begins. English-medium pagination may differ, so those pages are added only after checking the English book.',
    'about.p3': 'This is an unofficial teaching aid. It does not copy textbook text or pictures. The virtual labs are simplified models for explaining the idea; they do not replace the real practical.',
    'about.p4': 'Official textbooks are available from the Educational Publications Department and e-thaksalawa:',
    'foot': 'Unofficial teaching aid · not affiliated with the Ministry of Education or NIE · text: CC BY 4.0 · code: MIT'
  },
  ta: {
    'app.tag': 'தரம் 11 விஞ்ஞானம் பகுதி I: ஊடாடும் செய்முறைச் செயற்பாடுகள்',
    'lib.h': 'செய்முறைச் செயற்பாடுகள்', 'lib.lead': 'தரம் 11 விஞ்ஞானம், பகுதி I: பாடநூலிலுள்ள 46 செயற்பாடுகளும் பக்க எண்களுடன். ஒன்றைத் திறந்து கற்பிக்கவும்; உண்மையில் என்ன நடக்கிறது என்பதைக் காட்ட மெய்நிகர் ஆய்வுகூடத்தைப் பயன்படுத்தவும்.',
    'f.unit': 'அலகு', 'f.all': 'அனைத்தும்', 'f.lab': 'மெய்நிகர் ஆய்வுகூடம் மட்டும்', 'f.search': 'செயற்பாடுகளைத் தேடுக…', 'f.none': 'பொருந்தும் செயற்பாடுகள் இல்லை.', 'f.count': '{n} செயற்பாடுகள்',
    'a.act': 'செயற்பாடு', 'a.page': 'பக்கம்', 'a.virtual': 'மெய்நிகர் ஆய்வுகூடம்', 'a.goal': 'இதை முயன்று பாருங்கள்', 'a.nolab': 'இந்தச் செயற்பாட்டுக்கு மெய்நிகர் ஆய்வுகூடம் இன்னும் இல்லை. பாடநூல் பக்கத்தைப் பயன்படுத்துக.', 'a.chk': 'சுருக்க விளக்கத்தைப் பாடநூலுடன் உறுதிசெய்ய வேண்டும்.',
    'k.lab': 'பரிசோதனை', 'k.obs': 'அவதானிப்பு', 'k.model': 'மாதிரி', 'k.disc': 'கலந்துரையாடல்',
    'p.back': '← அனைத்துச் செயற்பாடுகளும்', 'p.present': 'கற்பித்தல் பயன்முறை', 'p.exit': 'பயன்முறையிலிருந்து வெளியேறு', 'p.print': 'அச்சிடு',
    'r.title': 'பாடநூல் பக்கம்', 'r.src.ta': 'தமிழ் மொழிமூல நூல்; அச்சிடப்பட்ட பக்க எண்களுடன் சரிபார்க்கப்பட்டது', 'r.en.fallback': 'ஆங்கில மொழிமூலப் பக்கம் இன்னும் சேர்க்கப்படவில்லை. தமிழ் மொழிமூலப் பக்கம் காட்டப்படுகிறது.', 'r.none': 'பக்க எண் இன்னும் சேர்க்கப்படவில்லை',
    'r.help': 'உங்கள் பாடநூலைத் திறந்து பக்க எண்களை உள்ளிடுங்கள். அவை இந்தச் சாதனத்தில் சேமிக்கப்படும். GitHub மூலம் பகிர நகலெடுக்கவும்.', 'r.edit': 'பக்க எண்ணைச் சேர் அல்லது மாற்று',
    'r.book': 'பாடநூல் தலைப்பு', 'r.edition': 'பதிப்பு / ஆண்டு', 'r.pages': 'செயற்பாட்டுப் பக்கம்', 'r.extra': 'மேலதிகப் பக்கங்கள்', 'r.chk': 'இதைப் பாடநூலில் சரிபார்த்தேன்',
    'r.save': 'இந்தச் சாதனத்தில் சேமி', 'r.copy': 'GitHub க்காக நகலெடு', 'r.saved': 'இந்தச் சாதனத்தில் சேமிக்கப்பட்டது.', 'r.copied': 'நகலெடுக்கப்பட்டது. data/refs.js இல் ஒட்டி pull request திறக்கவும்.', 'r.copyfail': 'உலாவி நகலெடுப்பதைத் தடுத்தது.', 'r.verified': 'சரிபார்க்கப்பட்டது', 'r.unverified': 'சரிபார்க்கப்படவில்லை',
    'm.ta': 'தமிழ் மொழிமூலம்', 'm.en': 'ஆங்கில மொழிமூலம்', 'notfound': 'செயற்பாடு கிடைக்கவில்லை.', 'about.link': 'விவரம் & உதவி', 'about.h': 'இந்தத் திட்டம் பற்றி',
    'about.p1': 'Lab Guide G11 தரம் 11 விஞ்ஞான பாடநூலின் செய்முறைச் செயற்பாடுகளை ஆசிரியர்கள் விளக்க உதவுகிறது. ஒவ்வொரு செயற்பாட்டுக்கும் பக்க எண் உள்ளது; பலவற்றுக்கு வகுப்பில் திரையிடக்கூடிய ஊடாடும் மெய்நிகர் ஆய்வுகூடமும் உள்ளது.',
    'about.p2': 'பக்க எண்கள் பகுதி I தமிழ் மொழிமூல பாடநூலிலிருந்து எடுக்கப்பட்டவை; ஒவ்வொரு செயற்பாடும் தொடங்கும் பக்கத்தைக் குறிக்கின்றன. ஆங்கில மொழிமூல நூலில் பக்கங்கள் வேறுபடலாம்; ஆகவே ஆங்கில நூலைச் சரிபார்த்த பின்பே அவை சேர்க்கப்படும்.',
    'about.p3': 'இது அதிகாரபூர்வமற்ற கற்பித்தல் உதவி. பாடநூல் எழுத்துக்களையோ படங்களையோ நகலெடுக்காது. மெய்நிகர் ஆய்வுகூடங்கள் கருத்தை விளக்கும் எளிமைப்படுத்தப்பட்ட மாதிரிகள்; உண்மையான செய்முறைக்கு மாற்றாகா.',
    'about.p4': 'அதிகாரபூர்வ பாடநூல்கள் கல்வி வெளியீட்டுத் திணைக்களம், e-thaksalawa ஆகியவற்றில் கிடைக்கும்:',
    'foot': 'அதிகாரபூர்வமற்ற கற்பித்தல் உதவி · கல்வி அமைச்சு அல்லது NIE உடன் தொடர்பில்லை · உரை: CC BY 4.0 · நிரல்: MIT'
  }
};
const t = (k, v) => { let s = (UI[LANG] && UI[LANG][k]) || UI.en[k] || k; if(v) for(const x in v) s = s.replace('{' + x + '}', v[x]); return s; };