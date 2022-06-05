# Calculation_App

## Descripsiton
RecursionのProjectで作成した計算機アプリです。

Vue.jsの練習を兼ねて作成しました。

スタックを使って文字列の式を左から解析し、答えを返します。

![calculation_app](https://user-images.githubusercontent.com/101968115/172043605-20ac84f1-aef4-466a-93d2-1ea0fcc292b0.png)

## Url
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
