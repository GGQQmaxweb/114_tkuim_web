// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var a = prompt('輸入 A');
var b = prompt('輸入 B');
a = parseInt(a, 10);
b = parseInt(b, 10);

var output = '';
for (var i = 1; i <= a; i++) {
  for (var j = 1; j <= b; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}
document.getElementById('result').textContent = output;
