/* ==========================================================
   2027 丁未 신년 사주 — 계산 엔진 + 해석 데이터 + UI
   ========================================================== */
'use strict';

/* ---------------- 1. 기본 상수 ---------------- */
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const STEM_KO = ['갑','을','병','정','무','기','경','신','임','계'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_KO = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
const STEM_ELEM = ['목','목','화','화','토','토','금','금','수','수'];
const BRANCH_ELEM = ['수','토','목','목','토','화','화','토','금','금','토','수'];
const BRANCH_HIDDEN = [9,5,0,1,4,2,3,5,6,7,4,8]; // 지장간 본기(천간 index)
const ZODIAC = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const ELEMS = ['목','화','토','금','수'];
const SHENG = {목:'화', 화:'토', 토:'금', 금:'수', 수:'목'};   // 상생
const KEUK  = {목:'토', 토:'수', 수:'화', 화:'금', 금:'목'};   // 상극

const HOURS = [
  {b:0,  name:'자시', hanja:'子時', range:'23:00~01:00', mid:0},
  {b:1,  name:'축시', hanja:'丑時', range:'01:00~03:00', mid:2},
  {b:2,  name:'인시', hanja:'寅時', range:'03:00~05:00', mid:4},
  {b:3,  name:'묘시', hanja:'卯時', range:'05:00~07:00', mid:6},
  {b:4,  name:'진시', hanja:'辰時', range:'07:00~09:00', mid:8},
  {b:5,  name:'사시', hanja:'巳時', range:'09:00~11:00', mid:10},
  {b:6,  name:'오시', hanja:'午時', range:'11:00~13:00', mid:12},
  {b:7,  name:'미시', hanja:'未時', range:'13:00~15:00', mid:14},
  {b:8,  name:'신시', hanja:'申時', range:'15:00~17:00', mid:16},
  {b:9,  name:'유시', hanja:'酉時', range:'17:00~19:00', mid:18},
  {b:10, name:'술시', hanja:'戌時', range:'19:00~21:00', mid:20},
  {b:11, name:'해시', hanja:'亥時', range:'21:00~23:00', mid:22}
];

const NEW_YEAR = 2027;          // 정미년
const NEW_YEAR_STEM = 3;        // 丁
const NEW_YEAR_BRANCH = 7;      // 未

/* ---------------- 2. 해석 데이터 (일간 10종) ---------------- */
const SIPSEONG_DESC = {
  '비견':'나와 같은 기운이 하나 더 붙는 해',
  '겁재':'돈과 공을 나눠 갖게 되는 해',
  '식신':'좋아하는 일로 먹고사는 힘이 붙는 해',
  '상관':'재주와 말이 밖으로 터져 나오는 해',
  '편재':'뜻밖의 수입이 생기는 해',
  '정재':'벌어들인 만큼 착실히 쌓이는 해',
  '편관':'시험과 압박을 지나 단단해지는 해',
  '정관':'이름과 자리가 붙는 해',
  '편인':'혼자 깊어지고 감각이 살아나는 해',
  '정인':'배움과 돌봄이 들어오는 해'
};

const STEM_DATA = [
  { // 甲
    ko:'갑목', hanja:'甲', elem:'목', yy:'양', image:'큰 나무',
    self:'한번 방향을 정하면 끝까지 밀고 나가는 곧은 추진력',
    base:{money:63, love:57, work:75, health:55},
    texts:{
      total:'2027년은 갑목인 당신에게 丁화의 <b>상관(傷官)</b>이 들어오는 해예요. 안에서 키워 온 생각과 재주가 밖으로 터져 나오면서, 말과 글로 사람을 움직이는 일이 잘 풀립니다. 다만 상관은 위로 뻗는 기운이라 말이 먼저 나가기 쉬우니, 한 번 더 골라 내보내면 그만큼 멀리 갑니다.',
      money:'未토가 <b>정재(正財)</b>로 들어와 벌어들인 돈이 착실히 쌓이는 구조예요. 한탕보다 단가가 확실한 일을 여러 개 붙이는 쪽이 유리하고, 3~4월과 9월에 들어온 돈은 따로 남겨 두세요. 재주를 상품으로 바꾸는 시도—강의, 전자책, 외주—가 첫 결실을 맺기 좋은 해입니다.',
      love:'표현이 시원해져 새로운 인연이 눈에 잘 띄는 해예요. 다만 상관의 직설은 상대에게 날카롭게 꽂히니, 칭찬 한마디를 먼저 두는 습관이 관계를 오래 가게 합니다. 5월과 11월에는 마음이 크게 흔들리는 일이 있으니 큰 결정은 하루 미뤄 두세요.',
      work:'일에서 확실히 주인공이 되는 해예요. 기획을 세워 사람들 앞에 꺼내는 자리—발표, 제안, 콘텐츠—에서 성과가 나고, 남의 이름보다 내 이름을 걸 수 있는 일이 잘 맞습니다. 9월 이후 들어오는 새 제안은 겁내지 말고 받아 보세요.',
      health:'화 기운이 세게 들어와 열이 위로 뜨기 쉬운 해예요. 목과 어깨가 굳고 잠이 얕아지면 그게 신호이니, 밤 11시 이후의 일은 미루고 물을 자주 드세요. 봄과 가을에 30분 걷기를 규칙적으로 하면 한 해가 훨씬 가벼워집니다.'
    },
    lucky:{color:'딥 블루', hex:'#2E4C8C', number:'6', dir:'북쪽', keyword:'표현',
      note:'단단한 나무에게 물을 주는 색이에요. 말하기 전에 한 번 정리하는 습관과 함께 쓰면 좋습니다.'}
  },
  { // 乙
    ko:'을목', hanja:'乙', elem:'목', yy:'음', image:'덩굴과 화초',
    self:'부드럽게 휘어지며 결국엔 끝까지 올라가는 생존력',
    base:{money:73, love:70, work:66, health:72},
    texts:{
      total:'2027년은 을목인 당신에게 丁화의 <b>식신(食神)</b>이 들어오는 해예요. 좋아하는 일을 오래, 즐겁게 해서 먹고사는 힘이 붙는 해라, 억지로 버티기보다 재미있는 쪽으로 몸을 옮기면 길이 열립니다. 덩굴처럼 다른 사람과 환경에 기대어 자라는 게 을목의 재주이니, 혼자 다 하려는 마음만 내려놓으면 됩니다.',
      money:'未토가 <b>편재(偏財)</b>로 들어와 뜻밖의 수입이 생기는 해예요. 부업, 소개로 들어온 일, 오래 묵힌 물건의 정리 같은 데서 돈이 됩니다. 다만 편재는 들어온 만큼 새기 쉬우니 7월과 12월에는 지출을 한 번 점검하세요.',
      love:'식신은 사람을 편안하게 만드는 기운이라, 함께 있으면 마음이 놓이는 인연이 찾아옵니다. 잘 웃고 잘 먹는 자리—맛집, 산책, 소소한 모임—에 인연이 숨어 있어요. 6월과 10월에 시작된 인연은 천천히 키우면 오래갑니다.',
      work:'새로 벌이기보다 이미 하는 일을 다듬을 때 성과가 커지는 해예요. 손에 익은 일을 콘텐츠나 서비스로 다듬어 내놓으면 반응이 옵니다. 4월과 10월에 협업 제안이 오면 흔쾌히 응해 보세요, 을목은 함께할 때 더 강합니다.',
      health:'기운이 고르게 도는 편안한 해지만, 즐거움에 기대다 보면 식사와 수면이 흐트러지기 쉬워요. 늦은 야식과 단 음료만 줄여도 몸이 확 달라집니다. 3월과 9월에는 목과 손목을 풀어 주는 스트레칭을 챙기세요.'
    },
    lucky:{color:'세이지 그린', hex:'#8FB08A', number:'3', dir:'동쪽', keyword:'연결',
      note:'혼자 자라지 않는 풀과 잘 맞는 색이에요. 누군가에게 먼저 연락하는 일이 이 해의 문을 엽니다.'}
  },
  { // 丙
    ko:'병화', hanja:'丙', elem:'화', yy:'양', image:'한낮의 태양',
    self:'가림 없이 세상을 밝히는 뜨거운 존재감',
    base:{money:48, love:62, work:66, health:56},
    texts:{
      total:'2027년은 병화인 당신에게 丁화의 <b>겁재(劫財)</b>가 들어오는 해예요. 나와 비슷한 기운이 하나 더 붙어 경쟁과 협력이 동시에 일어납니다. 태양이 두 개면 세상이 밝아지지만 서로의 그늘도 생기니, 돈과 공은 처음부터 문서로 나눠 두는 게 이 해의 지혜예요.',
      money:'겁재는 재물을 나눠 갖는 별이라, 들어오는 돈도 있지만 새는 돈도 많은 해예요. 보증·동업·지인 대여는 이 해에 가장 조심할 부분이고, 통장을 하나 더 만들어 생활비를 분리하면 새는 구멍이 절반은 막힙니다. 5월과 11월에는 큰 지출을 미루세요.',
      love:'기운이 뜨거워 인연이 빠르게 붙는 해예요. 다만 상관이 함께 들어와 상대의 흠이 먼저 눈에 들어오니, 첫인상의 감정으로 사람을 정리하지 마세요. 2월과 8월에 만난 사람은 조금 천천히 지켜보면 의외로 오래갑니다.',
      work:'앞에 나서는 자리에서 힘을 쓰는 해예요. 다만 혼자 다 짊어지려 하면 소진되니, 역할을 나누고 이름을 함께 올리는 방식이 오래 갑니다. 6월과 10월의 경쟁 구도는 피하지 말고 정면으로 붙어 보세요.',
      health:'열이 많고 맥이 빠르게 오르는 해라 심장·혈압·눈의 피로를 살펴야 해요. 잠들기 전 휴대폰을 내려놓는 것만으로도 회복이 달라지고, 매운 것과 술은 줄이는 편이 좋습니다.'
    },
    lucky:{color:'골드', hex:'#E8C87A', number:'2', dir:'남쪽', keyword:'휴식',
      note:'타오르는 불에는 잠깐의 그늘이 필요해요. 하루 한 번 아무것도 하지 않는 10분을 이 색으로 채워 보세요.'}
  },
  { // 丁
    ko:'정화', hanja:'丁', elem:'화', yy:'음', image:'촛불과 별빛',
    self:'작지만 어둠을 정확히 밝히는 섬세한 감각',
    base:{money:55, love:58, work:62, health:60},
    texts:{
      total:'2027년은 정화인 당신에게 丁화가 <b>비견(比肩)</b>으로 겹쳐 들어오는 해예요. 같은 불이 하나 더 붙어 마음이 든든해지는 동시에, 조금만 세지면 서로의 빛을 가리게 됩니다. 내 것과 남의 것을 분명히 나누고, 비교보다 각자의 자리를 인정하면 불꽃이 오래갑니다.',
      money:'비견은 재물을 나눠 쓰는 자리라, 공동 지출과 "같이 하자"는 제안이 늘어나는 해예요. 좋은 일이지만 비율을 정하지 않으면 감정이 상하니, 시작 전에 몫을 말해 두세요. 6월과 12월에 들어오는 수입은 이름 붙인 통장에 넣어 두면 잘 지켜집니다.',
      love:'비슷한 사람에게 끌리는 해예요. 나와 코드가 비슷한 상대라 편하지만, 서로 물러서지 않으면 불꽃이 부딪힙니다. 8월과 11월의 고백은 타이밍이 중요하니, 마음을 정리한 뒤에 움직이세요.',
      work:'내 실력을 알아봐 주는 자리가 생기는 해예요. 다만 동료와 같은 자리를 두고 경쟁할 수 있으니, 비교 대신 내가 잘하는 한 가지를 더 깊게 파세요. 3월과 9월에 맡게 되는 작은 일이 나중에 큰 이름이 됩니다.',
      health:'불이 겹치면 쉽게 지치고 얼굴이 달아오르며 잠이 얕아져요. 낮잠 15분, 오후 2시 이후 카페인 줄이기, 자기 전 따뜻한 물 한 잔이 이 해의 처방입니다.'
    },
    lucky:{color:'로즈 골드', hex:'#E2A6A0', number:'7', dir:'남서쪽', keyword:'정돈',
      note:'여러 개의 불을 하나로 모으는 색이에요. 책상과 휴대폰 화면을 정리하는 날 운이 트입니다.'}
  },
  { // 戊
    ko:'무토', hanja:'戊', elem:'토', yy:'양', image:'큰 산',
    self:'흔들리지 않고 주변을 품는 두터운 중심',
    base:{money:60, love:66, work:70, health:68},
    texts:{
      total:'2027년은 무토인 당신에게 丁화의 <b>정인(正印)</b>이 들어오는 해예요. 산을 덥혀 주는 온기처럼 나를 도와주는 사람과 배움이 붙는 해라, 공부·자격·문서에서 좋은 일이 생깁니다. 다만 편안함이 너무 커지면 움직일 때를 놓치니, 한 달에 한 번은 밖으로 나가는 약속을 스스로 만드세요.',
      money:'정인은 나를 채우는 별이라, 큰돈이 벌리기보다 새지 않고 지켜지는 해예요. 부동산·계약·보증 같은 큰 문서를 정리하기에 좋고, 4월과 10월에 들어오는 목돈은 반드시 장기로 묶어 두세요. 배움에 쓴 돈은 이듬해에 돌아옵니다.',
      love:'정인은 돌봄의 기운이라, 나를 편하게 해 주는 사람에게 마음이 갑니다. 다만 익숙함이 권태로 바뀌기 쉬우니 작은 여행이나 새 취미를 함께 시작해 보세요. 5월과 9월에는 소개 인연이 좋습니다.',
      work:'배우고 익혀 자리를 넓히는 해예요. 지금 하는 일과 다른 분야의 공부가 의외로 잘 붙어, 2월과 8월에 새로운 기회로 이어집니다. 겁재가 함께 오니 동업 제안은 조건을 글로 남긴 뒤에 응하세요.',
      health:'토가 두터워지는 해라 소화와 허리, 무릎을 살펴야 해요. 오래 앉아 있는 시간을 50분마다 끊고, 저녁 식사는 가볍게 하세요. 몸이 무거운 느낌이 3일 이상 이어지면 그때는 꼭 쉬어 주세요.'
    },
    lucky:{color:'샌드 베이지', hex:'#D9C7A7', number:'5', dir:'중앙', keyword:'가벼움',
      note:'무거운 흙에 바람을 넣는 색이에요. 가방과 서랍을 비우는 날 일이 술술 풀립니다.'}
  },
  { // 己
    ko:'기토', hanja:'己', elem:'토', yy:'음', image:'잘 가꾼 밭',
    self:'작은 씨앗을 키워 결실로 바꾸는 꾸준함',
    base:{money:58, love:55, work:64, health:58},
    texts:{
      total:'2027년은 기토인 당신에게 丁화의 <b>편인(偏印)</b>이 들어오는 해예요. 생각이 깊어지고 남다른 감각이 살아나는 해라, 취향과 전문성이 무기가 됩니다. 다만 편인은 혼자 파고드는 기운이라 사람과의 연결이 끊기면 답이 없어지니, 한 주에 한 번은 누군가에게 말로 설명하는 시간을 두세요.',
      money:'돈은 크게 벌기보다 새는 곳을 막는 해예요. 구독·자동결제·소액 결제를 정리하면 한 달에 생각보다 큰돈이 남습니다. 3월과 9월에 들어오는 수입은 재투자보다 비상금으로 두는 쪽이 안전합니다.',
      love:'마음을 잘 드러내지 않아 상대가 헷갈리기 쉬운 해예요. 좋으면 좋다고 말로 해 주세요, 이 해에는 그 한마디가 관계의 방향을 바꿉니다. 7월과 12월에는 오래된 인연이 다시 연결될 수 있어요.',
      work:'한 분야를 깊게 파는 해예요. 틈새 시장, 전문 자격, 취향을 살린 작은 브랜드가 잘 맞고 4월과 10월에 그 씨앗이 보입니다. 혼자 결정하지 말고 한 사람의 검수를 거치면 완성도가 달라집니다.',
      health:'생각이 많아지면 잠이 얕고 소화가 더뎌지는 해예요. 자기 전 30분은 화면 없이 보내고, 따뜻한 죽이나 국물로 속을 달래 주세요. 목과 어깨의 결림이 이 해의 신호입니다.'
    },
    lucky:{color:'모스 그린', hex:'#6E7F5B', number:'10', dir:'남서쪽', keyword:'경계',
      note:'잘 자란 밭에는 울타리가 필요해요. 부탁을 거절하는 연습이 이 해의 운을 지켜 줍니다.'}
  },
  { // 庚
    ko:'경금', hanja:'庚', elem:'금', yy:'양', image:'큰 칼과 바위',
    self:'한 번 내리치면 결판을 내는 단단한 결단력',
    base:{money:66, love:72, work:78, health:64},
    texts:{
      total:'2027년은 경금인 당신에게 丁화의 <b>정관(正官)</b>이 들어오는 해예요. 정관은 나를 반듯하게 세우는 별이라, 직함·자격·계약처럼 사회가 나를 알아보는 일이 잘 풀립니다. 단단한 금을 불이 다듬는 해이니, 다듬어지는 과정이 아프게 느껴져도 결과는 더 좋은 모양이 됩니다.',
      money:'정관이 오면 돈이 "자리"에서 나오는 해예요. 안정된 수입, 승진, 계약 갱신이 재물의 기둥이 되고, 투기보다 제도권 안의 저축·연금이 잘 맞습니다. 5월과 10월의 계약은 조건을 꼼꼼히 읽어 보세요, 이 해에는 문서가 곧 돈입니다.',
      love:'책임 있는 관계로 넘어가기 좋은 해예요. 소개나 공적인 자리에서 만난 인연이 진지하게 이어지고, 결혼·동거 같은 다음 단계를 이야기하기에도 좋습니다. 4월과 11월에 그런 대화가 오갑니다.',
      work:'2027년이 가장 빛나는 분야가 일이에요. 승진, 프로젝트 리드, 새 직장 같은 "자리"의 변화가 잘 붙고, 상사와 조직의 신뢰를 얻기 좋습니다. 3월과 9월에 오는 제안은 조건이 조금 불리해도 판을 키우는 쪽을 고르세요.',
      health:'금이 불에 다듬어지는 해라 목·폐·피부가 예민해질 수 있어요. 건조한 계절에는 물을 자주 마시고, 미세먼지 심한 날은 실내 운동으로 바꾸세요. 규칙적인 식사 시간이 이 해의 보약입니다.'
    },
    lucky:{color:'실버 그레이', hex:'#C7CCD6', number:'4', dir:'서쪽', keyword:'유연',
      note:'단단한 쇠에 탄력을 넣는 색이에요. "안 되면 이렇게" 한 가지 대안을 준비해 두면 마음이 편해집니다.'}
  },
  { // 辛
    ko:'신금', hanja:'辛', elem:'금', yy:'음', image:'세공된 보석',
    self:'티끌 하나도 용납하지 않는 예리한 완성도',
    base:{money:58, love:56, work:72, health:54},
    texts:{
      total:'2027년은 신금인 당신에게 丁화의 <b>편관(七殺)</b>이 들어오는 해예요. 편관은 나를 시험하는 별이라 압박과 도전이 함께 오지만, 그만큼 사람이 단단해집니다. 귀한 보석이 불에 단련되는 해이니, 힘든 일이 견디기 어려울 때는 이 해의 성격을 떠올려 보세요.',
      money:'크게 벌기보다 지키는 해예요. 편관은 재물을 압박하는 기운이라 예상 밖의 지출—수리, 병원, 세금—이 생기기 쉽습니다. 비상금을 3개월치로 늘려 두고, 6월과 12월에는 큰 지출을 피하세요.',
      love:'상대에게 무언가 증명하려는 마음이 커지는 해예요. 그 마음이 부담이 되지 않도록, 잘 보이려 하기보다 편하게 있어 주는 쪽이 오래갑니다. 2월과 8월에 찾아오는 인연은 서두르지 마세요.',
      work:'압박이 곧 성장인 해예요. 어려운 업무, 마감이 빡빡한 일을 맡게 되지만 그 일이 이력서에 남는 자산이 됩니다. 5월과 10월의 승부처에서 물러서지 마세요, 이 해의 성과는 대부분 그 자리에서 나옵니다.',
      health:'긴장이 몸에 쌓이기 쉬운 해예요. 목·어깨·턱이 굳고 잠이 얕아지면 이미 신호가 온 것입니다. 호흡을 길게 내쉬는 운동(요가·수영·빠르지 않은 걷기)을 주 3회 챙기세요.'
    },
    lucky:{color:'펄 화이트', hex:'#F3F0EA', number:'9', dir:'서쪽', keyword:'쉼',
      note:'예민한 보석은 비단 위에 놓을 때 빛나요. 잠들기 전 조명을 낮추는 것만으로 회복이 달라집니다.'}
  },
  { // 壬
    ko:'임수', hanja:'壬', elem:'수', yy:'양', image:'큰 바다와 강',
    self:'막힘없이 흘러 결국 바다에 닿는 넓은 그릇',
    base:{money:72, love:74, work:68, health:62},
    texts:{
      total:'2027년은 임수인 당신에게 丁화의 <b>정재(正財)</b>가 들어오는 해예요. 물이 불을 만나 서로의 값을 인정하는 형국이라, 노력한 만큼 확실히 돌아오는 한 해입니다. 다만 물이 넓어지면 방향을 잃기 쉬우니, 올해의 목표는 세 개 이내로 좁혀 두세요.',
      money:'이 해 재물운의 핵심은 "꾸준함"이에요. 월급·정산·고정 수입처럼 반복되는 돈이 잘 붙고, 부업도 단가가 정해진 일이 유리합니다. 4월과 9월에 들어오는 돈은 절반은 저축, 절반은 재투자로 나누면 좋습니다.',
      love:'정재는 현실적인 인연을 부르는 별이라, 조건과 마음이 함께 맞는 사람이 나타납니다. 결혼·동거·공동 생활 같은 구체적인 이야기가 잘 진행되고, 3월과 10월에 그 흐름이 보입니다.',
      work:'안정과 신뢰가 성과로 바뀌는 해예요. 오래 해 온 일에서 인정을 받고, 관리·정산·운영처럼 신뢰가 필요한 자리가 잘 맞습니다. 7월과 12월에는 새 일을 벌이기보다 지금 하는 일을 단단히 하세요.',
      health:'수 기운이 강한 사람에게 화·토가 들어오면 몸이 균형을 찾기 좋은 해예요. 다만 밤늦은 술과 야식은 부종으로 이어지니 자정 전 취침을 지키세요. 5월과 11월에는 신장·방광 쪽 검진을 챙기면 마음이 놓입니다.'
    },
    lucky:{color:'미드나잇 블루', hex:'#1E2A4A', number:'1', dir:'북쪽', keyword:'실행',
      note:'넓은 물에는 방향이 필요해요. 오늘 할 일 세 개만 적어 두는 습관이 이 해를 만들어 갑니다.'}
  },
  { // 癸
    ko:'계수', hanja:'癸', elem:'수', yy:'음', image:'이슬비와 샘',
    self:'조용히 스며들어 결국 다 적시는 섬세한 힘',
    base:{money:74, love:66, work:62, health:57},
    texts:{
      total:'2027년은 계수인 당신에게 丁화의 <b>편재(偏財)</b>가 들어오는 해예요. 촉촉한 이슬이 마른 땅에 스며들 듯, 예상하지 못한 곳에서 기회와 돈이 들어옵니다. 다만 편재는 들어오는 만큼 나가는 돈도 크니, 벌 때부터 남길 몫을 먼저 떼어 두는 습관이 이 해를 좌우합니다.',
      money:'재물운이 가장 활발한 해예요. 여러 곳에서 조금씩 들어오는 돈—부수입, 소개, 중고 거래, 소액 투자—이 모여 의미 있는 금액이 됩니다. 2월과 8월에 기회가 몰리니 그 전에 준비해 두세요. 큰 투자보다 작은 시도를 여러 번 하는 쪽이 맞습니다.',
      love:'사람을 만나는 자리가 늘고, 그 안에서 마음이 움직입니다. 다만 편관이 함께 와서 상대의 강한 기세에 휘둘리기 쉬우니, 내 속도로 가는 사람을 고르세요. 5월과 11월에 시작된 인연은 오래 봐야 진짜가 보입니다.',
      work:'여러 일을 동시에 다루는 해예요. 하나에 집중하기보다 작은 일 여러 개를 정확히 끝내는 능력이 빛을 봅니다. 9월에 들어오는 첫 제안이 방향을 정하니, 조건을 적어 두고 하루 뒤에 답하세요.',
      health:'물이 마르기 쉬운 해라 피부·목·눈이 건조해지고 피로가 쌓입니다. 물을 하루 1.5리터 이상 마시고 가습기를 곁에 두세요. 4월과 10월에는 잠을 몰아서 자지 말고 하루 7시간을 지키는 게 이 해의 처방입니다.'
    },
    lucky:{color:'라일락', hex:'#B9A6FF', number:'8', dir:'북동쪽', keyword:'말하기',
      note:'스며드는 물은 소리가 없어요. 하고 싶은 말을 미루지 않는 것만으로 올해의 기회가 붙잡힙니다.'}
  }
];

/* 띠와 未의 관계 */
function branchRelation(b){
  if (b === 7) return 'bonmyeong';                 // 未
  if (b === 11 || b === 3) return 'samhap';        // 亥·卯 삼합
  if (b === 6) return 'yukhap';                    // 午 육합
  if (b === 1) return 'chung';                     // 丑 충
  if (b === 10) return 'hyungpa';                  // 戌 형·파
  if (b === 0) return 'hae';                       // 子 해
  return 'none';
}

const REL = {
  samhap:{label:'삼합', score:'아주 좋음',
    mod:{total:6, money:3, love:5, work:3, health:1},
    total:'2027년은 당신의 띠가 未와 <b>삼합(三合)</b>으로 묶이는 해예요. 사람과 일이 나를 돕는 자리로 모여들어, 혼자 밀 때보다 함께할 때 두 배로 나아갑니다.',
    love:'띠의 삼합이 애정운을 밀어 줘요. 소개·모임·협업에서 사람이 붙으니, 나가는 자리를 아끼지 마세요.'},
  yukhap:{label:'육합', score:'좋음',
    mod:{total:6, money:2, love:6, work:2, health:2},
    total:'2027년은 당신의 띠가 未와 <b>육합(六合)</b>을 이루는 해예요. 귀인이 붙고 막혔던 일이 풀리니, 사람에게 먼저 말을 거는 쪽이 이깁니다.',
    love:'띠의 육합이 인연을 붙여 줘요. 오래 망설인 사람에게 먼저 다가가기 좋은 해입니다.'},
  chung:{label:'충', score:'주의', mod:{total:-6, money:-3, love:-4, work:-3, health:-5},
    total:'2027년은 당신의 띠가 未와 <b>충(衝)</b>하는 해예요. 이사·이직·관계의 큰 변화가 찾아오니, 흔들릴 때일수록 서류와 약속을 한 번 더 확인하세요.',
    love:'띠의 충이 관계를 흔들 수 있어요. 갑작스러운 말과 결정을 미루고, 상대의 말을 끝까지 들어 주면 오히려 깊어집니다.'},
  hyungpa:{label:'형·파', score:'주의', mod:{total:-5, money:-2, love:-3, work:-3, health:-3},
    total:'2027년은 당신의 띠가 未와 <b>형(刑)·파(破)</b>가 겹치는 해예요. 말과 서류에서 작은 실수가 생기기 쉬우니, 계약서와 메시지를 한 번 더 읽는 습관이 필요합니다.',
    love:'띠의 형·파가 오해를 만들 수 있어요. 문자보다 통화, 통화보다 만남이 이 해의 관계를 지켜 줍니다.'},
  hae:{label:'해', score:'무난', mod:{total:-3, money:-1, love:-3, work:-1, health:-1},
    total:'2027년은 당신의 띠가 未와 <b>해(害)</b>를 이루는 해예요. 괜한 서운함이 생기기 쉬우니, 추측 대신 물어보는 습관 하나가 관계를 지켜 줍니다.',
    love:'띠의 해가 서운함을 만들 수 있어요. 서운한 마음은 그날 안에 말로 꺼내 두세요.'},
  bonmyeong:{label:'본명년', score:'전환', mod:{total:2, money:0, love:1, work:0, health:-4},
    total:'2027년은 당신의 띠인 未의 해, <b>본명년(本命年)</b>이에요. 크게 바뀌는 해이니 크게 벌이기보다 몸과 마음을 지키는 데 힘을 쓰세요.',
    love:'본명년에는 감정의 기복이 커져요. 관계를 새로 만들기보다 지금 있는 인연을 돌보는 쪽이 좋습니다.'},
  none:{label:'무관', score:'무난', mod:{total:0, money:0, love:0, work:0, health:0},
    total:'2027년은 당신의 띠와 未가 크게 부딪히지도, 크게 붙지도 않는 해예요. 내 페이스대로 쌓은 만큼 그대로 남습니다.',
    love:'띠의 관계는 평온해요. 관계의 온도는 결국 내가 내는 말과 시간이 정합니다.'}
};

/* 오행 결핍·과다 조언 */
const ELEM_ADVICE = {
  목:'여덟 글자에 목(木)이 없어요. 2027년에는 아침 햇빛을 10분 쐬고 초록을 가까이 두면 부족한 기운을 채우는 데 도움이 됩니다.',
  화:'여덟 글자에 화(火)가 없는데 2027년이 화의 해라, 올해 들어오는 열기를 잘 쓰면 오래 미뤄 둔 일이 움직입니다. 다만 열이 갑자기 오르니 물과 수면을 챙기세요.',
  토:'여덟 글자에 토(土)가 없어요. 2027년의 토가 재물의 그릇을 채워 주니, 돈을 모으는 통장 하나를 정해 두면 좋습니다.',
  금:'여덟 글자에 금(金)이 없어요. 결단이 늦어지기 쉬우니, 미루던 결정 하나를 정한 날에 끝내는 연습이 이 해의 약이 됩니다.',
  수:'여덟 글자에 수(水)가 없어요. 2027년의 화·토가 마르기 쉬운 해라, 물과 잠을 일부러 챙겨야 몸이 버팁니다.'
};
const ELEM_DOMINANT = {
  목:'목이 많은 사주라 생각과 계획이 앞서기 쉬워요. 올해는 계획을 세 개 이내로 줄이고 하나를 끝내는 데 힘을 쓰세요.',
  화:'화가 많은 사주에 화의 해가 겹쳤어요. 의욕은 넘치지만 쉽게 타 버리니, 일과 쉼의 경계를 시간으로 정해 두세요.',
  토:'토가 많은 사주라 고집과 무거움이 함께 와요. 몸을 가볍게 하고 새로운 사람을 만나는 일이 이 해의 약입니다.',
  금:'금이 많은 사주라 기준이 높고 예민해요. 완벽을 80%로 낮추는 연습이 2027년의 성과를 앞당깁니다.',
  수:'수가 많은 사주라 생각이 깊고 감정이 많아요. 머릿속을 밖으로 꺼내 말과 글로 남기면 길이 열립니다.'
};

/* ---------------- 3. 천문·역법 계산 ---------------- */
const mod = (n, m) => ((n % m) + m) % m;
const norm180 = (x) => mod(x + 180, 360) - 180;

/** KST 시각 → 율리우스 적일 */
function jdOf(y, m, d, kstHour){
  const ms = Date.UTC(y, m - 1, d, 0, 0, 0) + (kstHour - 9) * 3600000;
  return 2451545.0 + (ms - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
}

/** 태양의 겉보기 황경(도, 0~360) — Meeus 저정밀 */
function sunLongitude(jd){
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
          + 0.000289 * Math.sin(3 * M);
  const trueLon = L0 + C;
  const Om = (125.04 - 1934.136 * T) * Math.PI / 180;
  return mod(trueLon - 0.00569 - 0.00478 * Math.sin(Om), 360);
}

/** 절입 시각(JD). deg는 목표 황경 */
const TERM_GUESS = {315:[2,4], 345:[3,6], 15:[4,5], 45:[5,6], 75:[6,6],
                    105:[7,7], 135:[8,8], 165:[9,8], 195:[10,8], 225:[11,7],
                    255:[12,7], 285:[1,6], 300:[1,20], 330:[2,19]};
function findTerm(year, deg){
  const g = TERM_GUESS[deg] || [2, 4];
  let lo = jdOf(year, g[0], g[1], 0) - 7;
  let hi = lo + 14;
  for (let i = 0; i < 60; i++){
    const mid = (lo + hi) / 2;
    if (norm180(sunLongitude(mid) - deg) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

const branchOf = (b) => BRANCHES[b] + BRANCH_KO[b];
const stemOf = (s) => STEMS[s] + STEM_KO[s];

/** 십성: 일간 → 대상 천간 */
function sipseong(dayStem, targetStem){
  const de = STEM_ELEM[dayStem], te = STEM_ELEM[targetStem];
  const same = (dayStem % 2) === (targetStem % 2);
  if (de === te)              return same ? '비견' : '겁재';
  if (SHENG[de] === te)       return same ? '식신' : '상관';
  if (KEUK[de] === te)        return same ? '편재' : '정재';
  if (KEUK[te] === de)        return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}

/** 사주 원국 계산 */
function buildChart(y, m, d, hourBranch){
  const hourMid = hourBranch >= 0 ? HOURS[hourBranch].mid : 12;
  const jd = jdOf(y, m, d, hourMid);
  const lon = sunLongitude(jd);

  // 년주 — 입춘(315°) 기준
  const ipchun = findTerm(y, 315);
  const sajuYear = jd >= ipchun ? y : y - 1;
  const yStem = mod(sajuYear - 4, 10);
  const yBranch = mod(sajuYear - 4, 12);

  // 월주 — 열두 절(節) 기준
  const shifted = mod(lon - 315, 360);
  const mIdx = Math.floor(shifted / 30);        // 0 = 인월
  const monthOrder = mIdx + 1;                   // 인월=1 … 축월=12
  const mBranch = (mIdx + 2) % 12;
  const mStem = mod(yStem * 2 + 1 + monthOrder, 10);

  // 일주 — 1900-01-01 갑술(甲戌) 기준
  const baseUTC = Date.UTC(1900, 0, 1);
  const days = Math.round((Date.UTC(y, m - 1, d) - baseUTC) / 86400000);
  const dayIdx = mod(10 + days, 60);
  const dStem = dayIdx % 10;
  const dBranch = dayIdx % 12;

  // 시주
  let hStem = null;
  if (hourBranch >= 0) hStem = mod(dStem * 2 + hourBranch, 10);

  const pillars = {
    year:  {s: yStem, b: yBranch},
    month: {s: mStem, b: mBranch},
    day:   {s: dStem, b: dBranch},
    hour:  hourBranch >= 0 ? {s: hStem, b: hourBranch} : null
  };

  const counts = {목:0, 화:0, 토:0, 금:0, 수:0};
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach(p => {
    if (!p) return;
    counts[STEM_ELEM[p.s]]++;
    counts[BRANCH_ELEM[p.b]]++;
  });

  return {
    jd, lon, sajuYear, yStem, yBranch, mStem, mBranch, dStem, dBranch, hStem,
    hourBranch, pillars, counts,
    totalCount: Object.values(counts).reduce((a, b) => a + b, 0),
    zodiac: ZODIAC[yBranch]
  };
}

/* ---------------- 4. 점수·서사 조합 ---------------- */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function elementNote(counts){
  const missing = ELEMS.filter(k => counts[k] === 0);
  if (missing.length) return ELEM_ADVICE[missing[0]];
  const max = Math.max(...ELEMS.map(k => counts[k]));
  const dom = ELEMS.find(k => counts[k] === max);
  return ELEM_DOMINANT[dom];
}

function buildModel(input){
  const chart = buildChart(input.y, input.m, input.d, input.hourBranch);
  const data = STEM_DATA[chart.dStem];
  const relKey = branchRelation(chart.yBranch);
  const rel = REL[relKey];

  const ssYear = sipseong(chart.dStem, NEW_YEAR_STEM);
  const ssYearBranch = sipseong(chart.dStem, BRANCH_HIDDEN[NEW_YEAR_BRANCH]);

  // 결정적 지터 (같은 입력 → 같은 결과)
  const seed = mod(dayHash(input), 97);
  const jit = k => ((seed * (k + 3) + k * 7) % 5) - 2;

  const counts = chart.counts;
  const em = {total:0, money:0, love:0, work:0, health:0};
  if (counts['화'] <= 1){ em.love += 4; em.work += 2; em.health -= 2; }
  if (counts['화'] >= 3){ em.health -= 6; em.money -= 2; em.love += 1; }
  if (counts['토'] <= 1){ em.money += 3; em.health -= 2; }
  if (counts['토'] >= 4){ em.health -= 3; em.work -= 2; em.money += 2; }
  if (counts['목'] === 0){ em.work -= 3; em.love -= 1; }
  if (counts['금'] === 0){ em.work -= 2; em.money -= 2; }
  if (counts['수'] === 0){ em.health -= 4; em.money -= 1; }

  const score = {};
  ['money','love','work','health'].forEach((k, i) => {
    score[k] = clamp(Math.round(data.base[k] + rel.mod[k] + em[k] + jit(i)), 42, 96);
  });
  const avg = (score.money + score.love + score.work + score.health) / 4;
  score.total = clamp(Math.round(avg + rel.mod.total * 0.5), 40, 97);

  const totalText = data.texts.total + ' ' + rel.total;
  const loveText = data.texts.love + ' ' + rel.love;
  const healthText = data.texts.health + ' ' + elementNote(counts);

  return {
    input, chart, data, rel, relKey, ssYear, ssYearBranch, score,
    texts:{total: totalText, money: data.texts.money, love: loveText,
           work: data.texts.work, health: healthText},
    lucky: data.lucky,
    pct: percentages(counts),
    meta: birthMeta(input, chart)
  };
}

function dayHash(input){
  return (input.y * 372 + input.m * 31 + input.d) * 7
       + (input.hourBranch + 1) * 13 + (input.name || '').length;
}

function percentages(counts){
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const raw = ELEMS.map(k => ({k, v: counts[k] / total * 100}));
  const rounded = raw.map(o => ({k:o.k, v: Math.round(o.v)}));
  let diff = 100 - rounded.reduce((a, o) => a + o.v, 0);
  if (diff !== 0){
    const idx = rounded.findIndex(o => o.v === Math.max(...rounded.map(r => r.v)));
    rounded[idx].v += diff;
  }
  return rounded;
}

function birthMeta(input, chart){
  const parts = [`${input.y}년 ${input.m}월 ${input.d}일`];
  if (input.hourBranch >= 0){
    const h = HOURS[input.hourBranch];
    parts.push(`${h.name} (${h.range})`);
  } else {
    parts.push('시간 모름');
  }
  if (input.gender === 'f') parts.push('여성');
  if (input.gender === 'm') parts.push('남성');
  return parts.join(' · ');
}

/* ---------------- 5. 렌더링 ---------------- */
const $ = (id) => document.getElementById(id);
const views = {home:$('view-home'), form:$('view-form'), loading:$('view-loading'), result:$('view-result')};
function show(name){
  Object.entries(views).forEach(([k, el]) => { el.hidden = (k !== name); });
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
}

function pillarHTML(p, label){
  if (!p) return `<div class="pillar"><div class="p-label">${label}</div>
    <div class="p-char" style="color:var(--muted-2)">—</div>
    <div class="p-ko">모름</div></div>`;
  const es = STEM_ELEM[p.s], eb = BRANCH_ELEM[p.b];
  return `<div class="pillar${label === '日' ? ' day' : ''}">
    <div class="p-label">${label}</div>
    <div class="p-char ${es}">${STEMS[p.s]}</div>
    <div class="p-char ${eb}">${BRANCHES[p.b]}</div>
    <div class="p-ko">${STEM_KO[p.s]}${BRANCH_KO[p.b]}</div>
    <div class="p-elem ${es}">${es}</div>
  </div>`;
}

function ringSVG(score){
  const r = 42, c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return `<div class="ring">
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f6e7c1"/><stop offset="55%" stop-color="#e9c97f"/>
        <stop offset="100%" stop-color="#b18ce0"/>
      </linearGradient></defs>
      <circle class="ring-bg" cx="48" cy="48" r="${r}"/>
      <circle class="ring-fg" cx="48" cy="48" r="${r}"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}"
        data-off="${off.toFixed(1)}"/>
    </svg>
    <div class="ring-num"><b>${score}</b><i>/ 100</i></div>
  </div>`;
}

function catHTML(title, hanja, score, text){
  return `<div class="cat">
    <div class="cat-head">
      <div class="cat-name">${title}<em>${hanja}</em></div>
      <div class="cat-score">${score}</div>
    </div>
    <div class="cat-track"><div class="cat-fill" style="width:0" data-w="${score}"></div></div>
    <p class="cat-text">${text}</p>
  </div>`;
}

function render(m){
  const c = m.chart, d = m.data;
  const nameLine = m.input.name ? `${escapeHTML(m.input.name)} 님` : '당신의 사주';
  const hourKnown = c.hourBranch >= 0;

  const card = $('card');
  card.innerHTML = `
    <header class="c-head">
      <p class="c-eyebrow">2027 丁未年 · 新年四柱</p>
      <h2 class="c-name">${nameLine}</h2>
      <p class="c-meta">${m.meta}</p>
      <div class="c-chips">
        <span class="chip">${c.zodiac}띠 · ${branchOf(c.yBranch)}년</span>
        <span class="chip lilac">丁 ${m.ssYear} · 未 ${m.ssYearBranch}</span>
      </div>
    </header>

    <div class="c-divider"></div>

    <div class="self">
      <div class="self-badge">${d.hanja}</div>
      <div class="self-body">
        <h3 class="self-title">${d.ko} <small>${d.image} · ${d.yy}${d.elem}</small></h3>
        <p class="self-desc">${d.self}</p>
      </div>
    </div>

    <div class="pillars">
      ${pillarHTML(c.pillars.hour, '時')}
      ${pillarHTML(c.pillars.day, '日')}
      ${pillarHTML(c.pillars.month, '月')}
      ${pillarHTML(c.pillars.year, '年')}
    </div>

    <div class="section-title"><h3>오행의 균형</h3>
      <span>${hourKnown ? '여덟 글자' : '여섯 글자 (시주 제외)'}</span></div>
    <div class="elem-bars">
      ${m.pct.map(p => `<div class="elem-row">
        <div class="elem-name">${p.k}</div>
        <div class="elem-track"><div class="elem-fill ${p.k}" style="width:0" data-w="${p.v}"></div></div>
        <div class="elem-pct">${p.v}%</div>
      </div>`).join('')}
    </div>

    <div class="section-title"><h3>2027 총운</h3><span>${m.rel.label} · ${m.rel.score}</span></div>
    <div class="total">
      ${ringSVG(m.score.total)}
      <div class="total-body">
        <p class="total-title">${SIPSEONG_DESC[m.ssYear]} 한 해</p>
        <p class="total-text">${m.texts.total}</p>
      </div>
    </div>

    ${catHTML('재물운', '財', m.score.money, m.texts.money)}
    ${catHTML('연애 · 대인운', '緣', m.score.love, m.texts.love)}
    ${catHTML('일 · 사업운', '業', m.score.work, m.texts.work)}
    ${catHTML('건강운', '身', m.score.health, m.texts.health)}

    <div class="section-title"><h3>2027 행운 포인트</h3><span>가볍게 참고</span></div>
    <div class="lucky">
      <div class="lucky-tile"><div class="lucky-k">행운의 색</div>
        <div class="lucky-v"><span class="swatch" style="background:${d.lucky.hex};color:${d.lucky.hex}"></span>${d.lucky.color}</div></div>
      <div class="lucky-tile"><div class="lucky-k">행운의 숫자</div>
        <div class="lucky-v">${d.lucky.number}</div></div>
      <div class="lucky-tile"><div class="lucky-k">행운의 방향</div>
        <div class="lucky-v">${d.lucky.dir}</div></div>
      <div class="lucky-tile"><div class="lucky-k">개운 키워드</div>
        <div class="lucky-v">${d.lucky.keyword}</div></div>
    </div>
    <p class="keyword-note">${d.lucky.note}</p>

    <div class="c-badge">
      <b>만든 곳</b>
      픽온 <a href="https://www.threads.com/@__o221" target="_blank" rel="noopener">@__o221</a>
      · 하루일본 <a href="https://www.instagram.com/haru.japan_/" target="_blank" rel="noopener">@haru.japan_</a>
    </div>`;

  // 애니메이션
  requestAnimationFrame(() => {
    card.querySelectorAll('.ring-fg').forEach(el => {
      el.style.strokeDashoffset = el.dataset.off;
    });
    card.querySelectorAll('[data-w]').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
  });
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

/* ---------------- 6. 이미지 저장 (Canvas) ---------------- */
function rrect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapText(ctx, text, maxWidth){
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words){
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line){
      lines.push(line); line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
function drawParagraph(ctx, text, x, y, maxWidth, lineHeight, maxLines){
  const plain = text.replace(/<[^>]+>/g, '');
  let lines = wrapText(ctx, plain, maxWidth);
  let truncated = false;
  if (lines.length > maxLines){ lines = lines.slice(0, maxLines); truncated = true; }
  if (truncated) lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*$/, '') + '…';
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

const ELEM_HEX = {목:'#83c98b', 화:'#ef8069', 토:'#d8b473', 금:'#b9c2d1', 수:'#6ea8dc'};

async function buildCardPNG(m){
  const W = 1080, H = 2280;
  try { await document.fonts.ready; } catch(e){}
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const x = cv.getContext('2d');

  // 배경
  const bg = x.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#16204c'); bg.addColorStop(.42, '#0b1130'); bg.addColorStop(1, '#05081a');
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  const g1 = x.createRadialGradient(W/2, -100, 60, W/2, -100, 900);
  g1.addColorStop(0, 'rgba(233,201,127,.26)'); g1.addColorStop(1, 'rgba(233,201,127,0)');
  x.fillStyle = g1; x.fillRect(0, 0, W, 900);
  const g2 = x.createRadialGradient(W*1.05, H*1.02, 60, W*1.05, H*1.02, 800);
  g2.addColorStop(0, 'rgba(150,130,235,.22)'); g2.addColorStop(1, 'rgba(150,130,235,0)');
  x.fillStyle = g2; x.fillRect(0, H - 900, W, 900);

  // 별
  let s = 13;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let i = 0; i < 90; i++){
    const px = rnd() * W, py = rnd() * H, r = rnd() * 1.6 + .4;
    x.fillStyle = `rgba(255,255,255,${.10 + rnd() * .35})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }

  // 테두리
  rrect(x, 44, 44, W - 88, H - 88, 40);
  x.strokeStyle = 'rgba(233,201,127,.30)'; x.lineWidth = 2; x.stroke();
  rrect(x, 62, 62, W - 124, H - 124, 30);
  x.strokeStyle = 'rgba(233,201,127,.12)'; x.lineWidth = 1; x.stroke();

  const serif = (size, weight = 600) => {
    x.font = `${weight} ${size}px "Noto Serif KR", "Nanum Myeongjo", serif`;
  };
  const sans = (size, weight = 400) => {
    x.font = `${weight} ${size}px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
  };
  const C = W / 2;
  x.textAlign = 'center';

  // 헤더
  serif(30, 400);
  x.fillStyle = '#e9c97f';
  x.letterSpacing = '10px';
  x.fillText('2 0 2 7   정 미 년', C, 168);
  x.letterSpacing = '0px';

  serif(72, 700);
  x.fillStyle = '#ffffff';
  const nameTxt = m.input.name ? m.input.name + ' 님' : '당신의 사주';
  x.fillText(nameTxt.length > 14 ? nameTxt.slice(0, 14) + '…' : nameTxt, C, 262);

  sans(28, 400); x.fillStyle = '#9c9cba';
  x.fillText(m.meta, C, 316);

  // 칩
  const chips = [`${m.chart.zodiac}띠`, `丁 ${m.ssYear}`, `未 ${m.ssYearBranch}`, `2027 ${m.score.total}점`];
  sans(24, 500);
  const widths = chips.map(t => x.measureText(t).width + 44);
  const totalW = widths.reduce((a, b) => a + b, 0) + (chips.length - 1) * 14;
  let cx = C - totalW / 2;
  chips.forEach((t, i) => {
    rrect(x, cx, 360, widths[i], 46, 23);
    x.fillStyle = 'rgba(233,201,127,.10)';
    x.fill();
    x.strokeStyle = 'rgba(233,201,127,.30)'; x.lineWidth = 1; x.stroke();
    x.fillStyle = '#f6e7c1';
    x.textAlign = 'center';
    x.fillText(t, cx + widths[i] / 2, 391);
    cx += widths[i] + 14;
  });

  // 구분선
  const line = x.createLinearGradient(W * .18, 0, W * .82, 0);
  line.addColorStop(0, 'rgba(233,201,127,0)');
  line.addColorStop(.5, 'rgba(233,201,127,.45)');
  line.addColorStop(1, 'rgba(233,201,127,0)');
  x.fillStyle = line; x.fillRect(W * .18, 448, W * .64, 1.5);

  // 일간
  serif(96, 600); x.fillStyle = '#f6e7c1';
  x.fillText(m.data.hanja, C, 570);

  serif(44, 600); x.fillStyle = '#ffffff';
  x.fillText(m.data.ko + ' · ' + m.data.image, C, 640);

  sans(26, 400); x.fillStyle = '#9c9cba';
  x.fillText(m.rel.label + ' 관계 · ' + m.rel.score, C, 690);

  // 오행 바
  let y = 736;
  sans(26, 600); x.fillStyle = '#e9c97f'; x.textAlign = 'left';
  x.fillText('오행의 균형', 120, y);
  sans(20, 400); x.fillStyle = '#767798'; x.textAlign = 'right';
  x.fillText(m.chart.hourBranch >= 0 ? '여덟 글자' : '여섯 글자', W - 120, y);
  y += 44;
  m.pct.forEach(p => {
    x.textAlign = 'left';
    sans(24, 500); x.fillStyle = ELEM_HEX[p.k];
    x.fillText(p.k, 120, y + 18);
    rrect(x, 168, y + 6, 640, 14, 7);
    x.fillStyle = 'rgba(255,255,255,.07)'; x.fill();
    if (p.v > 0){
      rrect(x, 168, y + 6, Math.max(10, 640 * p.v / 100), 14, 7);
      x.fillStyle = ELEM_HEX[p.k]; x.fill();
    }
    x.textAlign = 'right';
    sans(22, 400); x.fillStyle = '#9c9cba';
    x.fillText(p.v + '%', W - 120, y + 19);
    y += 44;
  });

  // 총운 점수
  y += 24;
  const ringY = y + 76, R = 76;
  x.beginPath(); x.arc(C, ringY, R, 0, Math.PI * 2);
  x.strokeStyle = 'rgba(255,255,255,.09)'; x.lineWidth = 10; x.stroke();
  x.beginPath();
  x.arc(C, ringY, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (m.score.total / 100));
  const ringGrad = x.createLinearGradient(C - R, ringY - R, C + R, ringY + R);
  ringGrad.addColorStop(0, '#f6e7c1'); ringGrad.addColorStop(.55, '#e9c97f'); ringGrad.addColorStop(1, '#b18ce0');
  x.strokeStyle = ringGrad; x.lineWidth = 10; x.lineCap = 'round'; x.stroke();
  x.textAlign = 'center';
  serif(58, 700); x.fillStyle = '#f6e7c1';
  x.fillText(String(m.score.total), C, ringY + 12);
  sans(19, 400); x.fillStyle = '#767798';
  x.fillText('/ 100', C, ringY + 40);

  y = ringY + R + 54;
  serif(32, 600); x.fillStyle = '#ffffff';
  x.fillText(SIPSEONG_DESC[m.ssYear] + ' 한 해', C, y);
  y += 42;
  sans(23, 400); x.fillStyle = '#c9c7de'; x.textAlign = 'center';
  y = drawParagraph(x, m.texts.total, C, y, W - 240, 34, 8);

  // 4개 항목
  y += 24;
  const items = [
    ['재물운', m.score.money], ['연애 · 대인운', m.score.love],
    ['일 · 사업운', m.score.work], ['건강운', m.score.health]
  ];
  items.forEach(([label, sc], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const bx = 120 + col * 430, by = y + row * 92;
    sans(24, 500); x.fillStyle = '#e6e3f2'; x.textAlign = 'left';
    x.fillText(label, bx, by + 26);
    serif(26, 600); x.fillStyle = '#e9c97f'; x.textAlign = 'right';
    x.fillText(String(sc), bx + 390, by + 27);
    rrect(x, bx, by + 42, 390, 8, 4);
    x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
    rrect(x, bx, by + 42, Math.max(8, 390 * sc / 100), 8, 4);
    const gg = x.createLinearGradient(bx, 0, bx + 390, 0);
    gg.addColorStop(0, '#9d86e6'); gg.addColorStop(1, '#e9c97f');
    x.fillStyle = gg; x.fill();
  });
  y += 92 * 2 + 20;

  // 행운
  const luck = [
    ['행운의 색', m.data.lucky.color, m.data.lucky.hex],
    ['행운의 숫자', m.data.lucky.number, null],
    ['행운의 방향', m.data.lucky.dir, null],
    ['개운 키워드', m.data.lucky.keyword, null]
  ];
  const tileW = (W - 240 - 3 * 14) / 4;
  luck.forEach(([k, v, hex], i) => {
    const tx = 120 + i * (tileW + 14);
    rrect(x, tx, y, tileW, 100, 18);
    x.fillStyle = 'rgba(255,255,255,.04)'; x.fill();
    x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 1; x.stroke();
    sans(18, 400); x.fillStyle = '#767798'; x.textAlign = 'center';
    x.fillText(k, tx + tileW / 2, y + 32);
    sans(21, 600); x.fillStyle = '#f0edf9';
    if (hex){
      x.beginPath(); x.arc(tx + tileW / 2 - x.measureText(v).width / 2 - 12, y + 68, 7, 0, Math.PI * 2);
      x.fillStyle = hex; x.fill();
      x.fillStyle = '#f0edf9';
    }
    x.fillText(v, tx + tileW / 2 + (hex ? 7 : 0), y + 70);
  });
  y += 100 + 36;

  sans(21, 400); x.fillStyle = '#767798'; x.textAlign = 'center';
  y = drawParagraph(x, m.data.lucky.note, C, y, W - 280, 32, 2);

  // 푸터
  x.fillStyle = 'rgba(233,201,127,.20)';
  x.fillRect(W * .22, H - 196, W * .56, 1);
  sans(18, 500); x.fillStyle = '#b99a5c';
  x.letterSpacing = '3px';
  x.fillText('만 든 곳', C, H - 156);
  x.letterSpacing = '0px';
  sans(24, 500); x.fillStyle = '#9c9cba';
  x.fillText('픽온 @__o221  ·  하루일본 @haru.japan_', C, H - 114);
  sans(19, 400); x.fillStyle = '#5f6080';
  x.fillText('2027 정미년 신년 사주 · saju-2027', C, H - 74);

  return cv;
}

/* ---------------- 7. 공유·이벤트 ---------------- */
function encodeParams(input){
  const p = new URLSearchParams();
  if (input.name) p.set('n', input.name);
  p.set('y', input.y); p.set('m', input.m); p.set('d', input.d);
  p.set('h', input.hourBranch);
  if (input.gender !== 'n') p.set('g', input.gender);
  return p.toString();
}
function shareURL(input){
  const base = location.origin + location.pathname;
  return `${base}?${encodeParams(input)}`;
}
function readParams(){
  const p = new URLSearchParams(location.search);
  if (!p.get('y')) return null;
  const y = +p.get('y'), m = +p.get('m'), d = +p.get('d');
  if (!validDate(y, m, d)) return null;
  return {
    name: (p.get('n') || '').slice(0, 12),
    y, m, d,
    hourBranch: p.get('h') === null ? -1 : clamp(+p.get('h'), -1, 11),
    gender: ['f','m'].includes(p.get('g')) ? p.get('g') : 'n'
  };
}

function validDate(y, m, d){
  if (!(y >= 1940 && y <= 2026)) return false;
  if (!(m >= 1 && m <= 12)) return false;
  if (!(d >= 1 && d <= 31)) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 300);
  }, 2400);
}

let currentModel = null;

async function run(input){
  show('loading');
  await new Promise(r => setTimeout(r, 950));
  currentModel = buildModel(input);
  render(currentModel);
  show('result');
  const url = shareURL(input);
  history.replaceState(null, '', url);
}

/* ---------------- 8. 폼 세팅 ---------------- */
function initForm(){
  const yearSel = $('fYear'), monthSel = $('fMonth'), daySel = $('fDay'), hourSel = $('fHour');
  let opts = '<option value="">년</option>';
  for (let y = 2026; y >= 1940; y--) opts += `<option value="${y}">${y}</option>`;
  yearSel.innerHTML = opts;
  opts = '<option value="">월</option>';
  for (let m = 1; m <= 12; m++) opts += `<option value="${m}">${m}</option>`;
  monthSel.innerHTML = opts;
  fillDays(31);

  opts = '<option value="-1">시간 모름</option>';
  HOURS.forEach(h => { opts += `<option value="${h.b}">${h.name} (${h.range})</option>`; });
  hourSel.innerHTML = opts;

  function fillDays(n){
    let s = '<option value="">일</option>';
    for (let d = 1; d <= n; d++) s += `<option value="${d}">${d}</option>`;
    const keep = daySel.value;
    daySel.innerHTML = s;
    if (keep && +keep <= n) daySel.value = keep;
  }
  yearSel.addEventListener('change', syncDays);
  monthSel.addEventListener('change', syncDays);
  function syncDays(){
    const y = +yearSel.value, m = +monthSel.value;
    if (!y || !m){ fillDays(31); return; }
    fillDays(new Date(y, m, 0).getDate());
  }

  document.querySelectorAll('.seg-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('is-on'));
      b.classList.add('is-on');
    });
  });
}

function collect(){
  const err = $('formErr');
  err.hidden = true;
  const y = +$('fYear').value, m = +$('fMonth').value, d = +$('fDay').value;
  if (!y || !m || !d){
    err.textContent = '생년월일을 모두 선택해 주세요.';
    err.hidden = false; return null;
  }
  if (!validDate(y, m, d)){
    err.textContent = '날짜를 다시 확인해 주세요. (1940~2026년)';
    err.hidden = false; return null;
  }
  const gender = document.querySelector('.seg-btn.is-on')?.dataset.g || 'n';
  return {
    name: $('fName').value.trim().slice(0, 12),
    y, m, d,
    hourBranch: +$('fHour').value,
    gender
  };
}

function fillForm(input){
  $('fName').value = input.name || '';
  $('fYear').value = input.y;
  $('fMonth').value = input.m;
  $('fMonth').dispatchEvent(new Event('change'));
  $('fDay').value = input.d;
  $('fHour').value = input.hourBranch;
  document.querySelectorAll('.seg-btn').forEach(b => {
    b.classList.toggle('is-on', b.dataset.g === input.gender);
  });
}

/* ---------------- 9. 부팅 ---------------- */
function starfield(){
  const box = $('stars');
  if (!box) return;
  const n = window.innerWidth < 480 ? 34 : 54;
  let html = '';
  for (let i = 0; i < n; i++){
    const top = Math.random() * 100, left = Math.random() * 100;
    const delay = (Math.random() * 4).toFixed(2);
    const size = Math.random() < .2 ? 3 : 2;
    html += `<span class="star" style="top:${top}%;left:${left}%;width:${size}px;height:${size}px;animation-delay:${delay}s"></span>`;
  }
  box.innerHTML = html;
}

function boot(){
  if (boot._done) return;
  boot._done = true;
  initForm();
  starfield();

  $('btnStart').addEventListener('click', () => show('form'));
  $('btnBack').addEventListener('click', () => show('home'));
  $('birthForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = collect();
    if (input) run(input);
  });

  $('btnAgain').addEventListener('click', () => {
    if (currentModel) fillForm(currentModel.input);
    show('form');
  });

  $('btnSave').addEventListener('click', async () => {
    if (!currentModel) return;
    toast('이미지를 만드는 중…');
    try {
      const cv = await buildCardPNG(currentModel);
      const name = (currentModel.input.name || '나').replace(/[^\w가-힣]/g, '');
      cv.toBlob(blob => {
        if (!blob){ toast('이미지를 만들 수 없어요'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `2027신년사주_${name}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('이미지를 저장했어요');
      }, 'image/png');
    } catch(err){
      console.error(err);
      toast('이미지를 만들 수 없어요');
    }
  });

  $('btnCopy').addEventListener('click', async () => {
    if (!currentModel) return;
    const url = shareURL(currentModel.input);
    try {
      await navigator.clipboard.writeText(url);
      toast('링크를 복사했어요');
    } catch(err){
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('링크를 복사했어요'); }
      catch(e){ toast('복사가 안 돼요. 주소창의 링크를 복사해 주세요'); }
      ta.remove();
    }
  });

  const fromURL = readParams();
  if (fromURL){
    fillForm(fromURL);
    run(fromURL);
  }
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
