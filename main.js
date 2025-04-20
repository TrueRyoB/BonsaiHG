document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const outputBonsai = document.getElementById('output-bonsai');
    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');
    const shareButton = document.getElementById('share-button');
    const shareLinkContainer = document.getElementById('share-link-container');
    const shareUrl = document.getElementById('share-url');

    let isFormDirty = false;

    window.addEventListener('beforeunload', function (e) {
        if (isFormDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // URLからテキストを取得
    function getTextFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedText = urlParams.get('text');
        if (encodedText) {
            return decodeURIComponent(encodedText);
        }
        return '';
    }

    // URLにテキストを設定
    function setTextToUrl(text) {
        const url = new URL(window.location.href);
        url.searchParams.set('text', encodeURIComponent(text));
        window.history.replaceState({}, '', url);

        // 共有用URLを更新
        shareUrl.value = url.href;
    }

    // 初期化: URLからテキストを取得して設定
    const initialText = getTextFromUrl();
    if (initialText) {
        inputText.value = initialText;
        generateBonsaiFromText(initialText);
    } else {
        generateDefaultBonsai();
    }

    // テキスト入力イベント
    inputText.addEventListener('input', function() {
        const text = inputText.value.trim();
        isFormDirty = inputText.value.trim() !== '';
        if (text === '') {
            generateDefaultBonsai();
            // URLからパラメータを削除
            window.history.replaceState({}, '', window.location.pathname);
        } else {
            generateBonsaiFromText(text);
            // URLにテキストを設定
            setTextToUrl(text);
        }
    });

    // クリアボタンイベント
    clearButton.addEventListener('click', function() {
        inputText.value = '';
        generateDefaultBonsai();
        // URLからパラメータを削除
        window.history.replaceState({}, '', window.location.pathname);
        shareLinkContainer.style.display = 'none';
    });

    // コピーボタンの処理
    copyButton.addEventListener('click', function() {
        const bonsaiText = outputBonsai.textContent;
        navigator.clipboard.writeText(bonsaiText).then(function() {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'コピー完了！';
            setTimeout(function() {
                copyButton.textContent = originalText;
            }, 2000);
        });
    });

    // 共有ボタンの処理
    shareButton.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (text !== '') {
            setTextToUrl(text);
            shareLinkContainer.style.display = 'block';
            shareUrl.select();
        }
    });

    // 共有URLのクリックでテキスト全選択
    shareUrl.addEventListener('click', function() {
        this.select();
    });

    // テキストからbonsaiを生成
    function generateBonsaiFromText(text) {
        // テキストからシード値を生成
        const seed = generateSeed(text);
        // シードベースのランダム生成関数を準備
        const random = seededRandom(seed);

        // cbonsai風の盆栽を生成
        outputBonsai.textContent = generateCbonsai(random);
    }

    // テキストからシード値を生成する関数
    function generateSeed(str) {
        let hash = 0;
        if (str.length === 0) return hash;

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }

        return Math.abs(hash);
    }

    // シードベースのランダム生成関数
    function seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    // 初期盆栽を表示
    function generateDefaultBonsai() {
        outputBonsai.textContent = `
    何かテキストを入力すると
    盆栽が生成されます...
                                          
　　　　　　　　 ＿_　　　　　　　　 ＿_
　　　　　　　　ヽ:::::ヽ　　　　　　／:::::/
　　　　　　　　 ,〉_,／￣￣\`￣＼::::::〈
　　　　　　　　／/ 　 ,　 /＼　.i i ヽ__ゝ
　　　　　　　 / /／∠ﾑ/ ー-V l　ｌヽ
　　　　　　　　 j v､!●　　● i　'　〈::::::ゝ
　　　　　　　　／ 〈　　ワ 　 ﾑ /i ヽ￣
　　　　　　 _/ ,.イ, \`ｰｩ　 ｔ-!,､_У 入＿
　　　　　　 ＼　＼/^､ ∧ , '^ｰ〈　／ ／
　　　　　　　　￣ /　\`:∞:::::'j　　＼￣
　　　　　　＜二,/ー､{:八:::::/ー､! 　＼＜二＞

`;
    }

    // cbonsai風の盆栽を生成する関数
    function generateCbonsai(random) {
        // 盆栽の基本パラメータ
        const age = Math.floor(random() * 5) + 3; // 3-7の範囲
        const baseWidth = Math.floor(random() * 10) + 20; // 20-30の範囲
        const baseHeight = Math.floor(random() * 10) + 15; // 15-25の範囲
        const canvasWidth = baseWidth + 10;
        const canvasHeight = baseHeight + 10;

        // 文字セット
        const trunkChars = ['|', '/', '\\', 'Y', 'V', 'L', 'J', '7', '1', 'i'];
        const branchChars = ['/', '\\', 'v', '>', '<', '^'];
        const leafChars = ['*', '@', 'o', '.', '&', '#', '%', '+'];

        // キャンバスの作成
        const canvas = Array(canvasHeight).fill().map(() => Array(canvasWidth).fill(' '));

        // 幹の開始位置
        const startX = Math.floor(canvasWidth / 2);
        const startY = canvasHeight - 1;

        // 盆栽の種類を決定
        const bonsaiType = Math.floor(random() * 4); // 0-3の範囲で4種類

        // 幹を描画
        drawTrunk(canvas, startX, startY, age, bonsaiType, trunkChars, branchChars, random);

        // 葉を描画
        drawLeaves(canvas, random, leafChars);

        // 鉢を追加
        addPot(canvas, startX, startY, random);

        // キャンバスをASCII文字列に変換
        return canvasToString(canvas);
    }

    // 幹を描画する関数
    function drawTrunk(canvas, x, y, age, type, trunkChars, branchChars, random) {
        let currentX = x;
        let currentY = y;

        // 幹の長さ
        const trunkLength = Math.floor(age * 1.5);

        // 基本的な幹を描画
        for (let i = 0; i < trunkLength; i++) {
            // 幹の方向を少しランダムに変える
            const dirChange = Math.floor(random() * 3) - 1; // -1, 0, 1
            currentX += dirChange;
            currentY--;

            // キャンバス内に収まるように調整
            currentX = Math.max(0, Math.min(canvas[0].length - 1, currentX));
            currentY = Math.max(0, Math.min(canvas.length - 1, currentY));

            // 幹の文字を選択
            canvas[currentY][currentX] = trunkChars[Math.floor(random() * trunkChars.length)];

            // 分岐を追加
            if (i > 1 && random() < 0.3) { // 30%の確率で分岐
                addBranch(canvas, currentX, currentY, trunkChars, branchChars, random);
            }
        }

        // 幹のタイプによって追加の特徴を加える
        switch(type) {
            case 0: // 通常の幹
                break;
            case 1: // 左に傾いた幹
                for (let i = 1; i < trunkLength; i++) {
                    if (y - i >= 0 && x - Math.floor(i/2) >= 0) {
                        canvas[y - i][x - Math.floor(i/2)] = trunkChars[Math.floor(random() * trunkChars.length)];
                    }
                }
                break;
            case 2: // 右に傾いた幹
                for (let i = 1; i < trunkLength; i++) {
                    if (y - i >= 0 && x + Math.floor(i/2) < canvas[0].length) {
                        canvas[y - i][x + Math.floor(i/2)] = trunkChars[Math.floor(random() * trunkChars.length)];
                    }
                }
                break;
            case 3: // 複雑な幹
                for (let i = 1; i < trunkLength; i++) {
                    if (random() < 0.5) { // 50%の確率で追加の幹を描画
                        const offsetX = Math.floor(random() * 5) - 2;
                        const offsetY = -Math.floor(random() * 3);
                        if (y + offsetY >= 0 && y + offsetY < canvas.length &&
                            x + offsetX >= 0 && x + offsetX < canvas[0].length) {
                            canvas[y + offsetY][x + offsetX] = trunkChars[Math.floor(random() * trunkChars.length)];
                        }
                    }
                }
                break;
        }
    }

    // 分岐を追加する関数
    function addBranch(canvas, x, y, trunkChars, branchChars, random) {
        // 分岐の方向 (左または右)
        const direction = random() < 0.5 ? -1 : 1;

        // 分岐の長さ
        const branchLength = Math.floor(random() * 3) + 1;

        for (let i = 1; i <= branchLength; i++) {
            const branchX = x + (i * direction);
            const branchY = y - i;

            // キャンバス内に収まるかチェック
            if (branchY >= 0 && branchY < canvas.length &&
                branchX >= 0 && branchX < canvas[0].length) {
                // 分岐の文字を選択
                canvas[branchY][branchX] = branchChars[Math.floor(random() * branchChars.length)];
            }
        }
    }

    // 葉を描画する関数
    function drawLeaves(canvas, random, leafChars) {
        // 葉の密度
        const density = random() * 0.2 + 0.1; // 0.1-0.3の範囲

        // キャンバスの上半分に葉を配置
        for (let y = 0; y < canvas.length / 2; y++) {
            for (let x = 0; x < canvas[0].length; x++) {
                // 既に何か描画されている場所の周りに葉を配置
                if (canvas[y][x] !== ' ') {
                    // 周囲8方向をチェック
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const newY = y + dy;
                            const newX = x + dx;

                            // キャンバス内かつ空白の場合
                            if (newY >= 0 && newY < canvas.length &&
                                newX >= 0 && newX < canvas[0].length &&
                                canvas[newY][newX] === ' ') {
                                // 密度に基づいてランダムに葉を配置
                                if (random() < density) {
                                    canvas[newY][newX] = leafChars[Math.floor(random() * leafChars.length)];
                                }
                            }
                        }
                    }
                }
            }
        }

        // 追加の葉を散らばせる
        const extraLeaves = Math.floor(random() * 10) + 5;
        for (let i = 0; i < extraLeaves; i++) {
            const leafY = Math.floor(random() * (canvas.length / 2));
            const leafX = Math.floor(random() * canvas[0].length);

            if (canvas[leafY][leafX] === ' ') {
                canvas[leafY][leafX] = leafChars[Math.floor(random() * leafChars.length)];
            }
        }
    }

    // 鉢を追加する関数
    function addPot(canvas, x, y, random) {
        // 鉢のスタイルをランダムに選択
        const potStyle = Math.floor(random() * 4);

        switch(potStyle) {
            case 0: // シンプルな四角い鉢
                for (let i = -3; i <= 3; i++) {
                    if (x + i >= 0 && x + i < canvas[0].length) {
                        canvas[y][x + i] = '_';
                        if (y + 1 < canvas.length) {
                            canvas[y + 1][x + i] = '=';
                        }
                    }
                }
                break;
            case 1: // 丸い鉢
                if (x - 3 >= 0 && x + 3 < canvas[0].length) {
                    canvas[y][x - 3] = '(';
                    canvas[y][x + 3] = ')';
                    for (let i = -2; i <= 2; i++) {
                        canvas[y][x + i] = '_';
                    }
                    if (y + 1 < canvas.length) {
                        canvas[y + 1][x - 2] = '(';
                        canvas[y + 1][x + 2] = ')';
                        for (let i = -1; i <= 1; i++) {
                            canvas[y + 1][x + i] = '_';
                        }
                    }
                }
                break;
            case 2: // 六角形の鉢
                if (x - 3 >= 0 && x + 3 < canvas[0].length) {
                    canvas[y][x - 3] = '/';
                    canvas[y][x + 3] = '\\';
                    for (let i = -2; i <= 2; i++) {
                        canvas[y][x + i] = '_';
                    }
                    if (y + 1 < canvas.length) {
                        canvas[y + 1][x - 2] = '\\';
                        canvas[y + 1][x + 2] = '/';
                        for (let i = -1; i <= 1; i++) {
                            canvas[y + 1][x + i] = '_';
                        }
                    }
                }
                break;
            case 3: // アジアンスタイルの鉢
                if (x - 4 >= 0 && x + 4 < canvas[0].length) {
                    canvas[y][x - 4] = '[';
                    canvas[y][x + 4] = ']';
                    for (let i = -3; i <= 3; i++) {
                        if (i !== -4 && i !== 4) {
                            canvas[y][x + i] = '=';
                        }
                    }
                    if (y + 1 < canvas.length) {
                        canvas[y + 1][x - 3] = '[';
                        canvas[y + 1][x + 3] = ']';
                        for (let i = -2; i <= 2; i++) {
                            if (i !== -3 && i !== 3) {
                                canvas[y + 1][x + i] = '-';
                            }
                        }
                    }
                }
                break;
        }
    }

    // キャンバスを文字列に変換
    function canvasToString(canvas) {
        // 無駄な空白行を削除するため、上下の境界を見つける
        let minY = canvas.length;
        let maxY = 0;
        let minX = canvas[0].length;
        let maxX = 0;

        for (let y = 0; y < canvas.length; y++) {
            for (let x = 0; x < canvas[0].length; x++) {
                if (canvas[y][x] !== ' ') {
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                }
            }
        }

        // 境界に余白を追加
        minY = Math.max(0, minY - 1);
        maxY = Math.min(canvas.length - 1, maxY + 1);
        minX = Math.max(0, minX - 2);
        maxX = Math.min(canvas[0].length - 1, maxX + 2);

        // キャンバスを文字列に変換
        let result = '';
        for (let y = minY; y <= maxY; y++) {
            let line = '';
            for (let x = minX; x <= maxX; x++) {
                line += canvas[y][x];
            }
            // 行末の空白を削除
            line = line.replace(/\s+$/, '');
            result += line + '\n';
        }

        return result;
    }
});