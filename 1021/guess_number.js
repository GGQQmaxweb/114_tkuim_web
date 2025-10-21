let guess = prompt("Guess a number between 1 and 100:");
let numberToGuess = Math.floor(Math.random() * 100) + 1;
let message = '';
while (true) {
    if (guess === null) {
        message = '遊戲取消。';
        break;
    } else {
        guess = parseInt(guess, 10);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            message = '請輸入有效的數字，範圍在1到100之間。';
        } else if (guess < numberToGuess) {
            message = '太低了！。';
        } else if (guess > numberToGuess) {
            message = '太高了！。';
        } else {
            message = '恭喜你，猜對了！答案是 ' + numberToGuess + '。';
            break;
        }
        guess = prompt(message);
    }
}

console.log(message);
document.getElementById("result").textContent = message;