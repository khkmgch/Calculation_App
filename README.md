# Calculation_App

## Descripsiton
Vue.jsの練習を兼ねて作成した計算機アプリです。

スタックを使って、ユーザーの入力（文字列の式）を左から解析し、答えを返します。

![calculation-app](https://github.com/khkmgch/Calculation_App/assets/101968115/6606547c-792c-4b05-a249-8eba50b43eb9)

## :globe_with_meridians:Url
https://khkmgch.github.io/Calculation_App/

## Usage
キーボード入力にも対応しています。

c  >>  ACボタン

Backspace  >> Delボタン

数値、演算子キーはボタンアイコンと同じものに対応しています。


負の数や括弧入力も計算可能です。

-1 + -2 = - 3

-1 - -2 = 1

3(1 + 2) = 9 

桁の多い数値は指数表記eで表示されます。

精度は小数点以下14桁までで、15桁以下は切り捨てて返します。
