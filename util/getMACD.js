/*
	EMA（10）= 前一日EMA（10）×9/11＋今日收盘价×2/11
	EMA（20）= 前一日EMA（20）×19/21＋今日收盘价×2/21
	DIFF=今日EMA（10）- 今日EMA（20）
	
	DEA（MACD）= 前一日DEA×8/10＋今日DIF×2/10 
	BAR=2×(DIFF－DEA)

*/