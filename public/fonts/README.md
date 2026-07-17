# 로컬 폰트 출처와 사용 조건

이 디렉터리의 폰트는 각 배포처에서 내려받은 파일이다. 화면 렌더링에는 필요한 weight만 연결하며 모든 `@font-face`는 `font-display: swap`을 사용한다.

폰트 선택 메뉴의 각 옵션에는 해당 폰트 stack을 직접 적용한다. 브라우저는 메뉴에 보이는 폰트 파일을 필요할 때 로드하며, 별도의 이미지 미리보기 자산은 두지 않는다.

| 폰트 | 로컬 파일 | 공식 출처 | 메모 |
| --- | --- | --- | --- |
| Maplestory | `maplestory/*.otf` | https://brand.nexon.com/ko/ci-brand-guidelines/typeface#section-mapleStory | 기존 400/700 OTF |
| 한컴 말랑말랑체 | `hancom-malangmalang/*.otf` | https://font.hancom.com/pc/sub/sub2_1.php | 기존 400/700 OTF |
| 조선명조 | `chosun-myeongjo/ChosunNm.ttf` | https://event.chosun.com/100/100font.html | 공식 TTF 원본. 배포 형태 유지 조건 때문에 변환·subset하지 않음 |
| 토스 머니그래피 | 로컬 저장 안 함 | https://toss.im/moneygraphy-font | 수정·재배포 금지 조건에 따라 토스 공식 `static.toss.im` WOFF2를 직접 사용 |
| 조선굴림 | `chosun-gulim/ChosunGu.ttf` | https://event.chosun.com/100/100font.html | 공식 TTF 원본. 배포 형태 유지 조건 때문에 변환·subset하지 않음 |
| 페이퍼로지 | `paperlogy/Paperlogy-{Thin..Black}.woff2`, `paperlogy/OFL.txt` | https://freesentation.blog/paperlogyfont | 공식 v1.001 TTF 9개 굵기를 WOFF2로 무손실 변환하고 SIL OFL 1.1 전문 보관 |

조선일보 서체는 개인·기업 사용자에게 무료로 제공되며 자유롭게 배포할 수 있지만, 복사·배포 대가를 요구할 수 없고 배포된 형태 그대로 사용해야 한다. 페이퍼로지는 SIL Open Font License에 따라 폰트 단독 판매와 라이선스 변경을 제외한 사용·수정·재배포가 가능하다. WOFF2 변환은 글리프를 subset하지 않고 압축 포맷만 바꿨다. 토스 머니그래피는 개인·기업 사용이 무료지만 수정·재배포할 수 없으므로 폰트 파일을 저장소와 public asset에 포함하지 않는다.
