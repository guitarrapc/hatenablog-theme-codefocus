あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

[:contents]

# 段落

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

#  画像（はてなフォトライフ）

[f:id:hatenablog:20101106100658j:image]

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# 脚注

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。[^1]

# 続きを読む

※トップページでのみ表示されます。記事ページでは表示されません。

<!-- more -->

# 罫線

---

# asin

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

[asin:4798110523:detail]

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# 引用

> 本日（11月12日）から11月27日まで、はてなダイアリーの公開デザインコンテスト「公開デザイン祭2007秋」を開催します。
>
> <cite>[「公開デザイン祭2007秋」を開始しました - はてなダイアリー日記](http://d.hatena.ne.jp/hatenadiary/20071112/1194858362)</cite>

# リスト（ul,ol,dl）

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

- 大賞1名：Amazonギフト券5万円分
- 入選9名：Amazonギフト券1万円分
    - 大賞1名：Amazonギフト券5万円分
    - 入選9名：Amazonギフト券1万円分

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

1. 大賞1名：Amazonギフト券5万円分
1. 入選9名：Amazonギフト券1万円分
    1. 大賞1名：Amazonギフト券5万円分
    1. 入選9名：Amazonギフト券1万円分

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

<dl>
<dt>大賞1名</dt>
<dd>Amazonギフト券5万円分</dd>
<dt>入選9名</dt>
<dd>Amazonギフト券1万円分</dd>
</dl>

# テーブル

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

|名前|色|個数|
|-|-|-|
|りんご|赤|1|
|みかん|だいだい|2|

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# コードブロック

文章中のコードブロック`dict`。

```css
.XXX {
width: 999px;
height: 999px;
}

.propA, .propB, .propC {
width: 999px;
height: 999px;
}

#YYY {
width: 9px;
height: 999px;
}
```

```terraform
resource "aws_s3_bucket" "example" {
  bucket = "terraform-example-s3-cloudfront"
}
```

```python
#!/usr/bin/env python3
from dataclasses import dataclass
from typing import List

# 2-D immutable point
@dataclass(frozen=True)
class Point:
    x: float; y: float
    def __add__(self, o: "Point") -> "Point":
        return Point(self.x + o.x, self.y + o.y)

def sum_points(ps: List[Point]) -> Point:
    total = Point(0, 0)
    for p in ps:
        total += p
    return total

if __name__ == "__main__":
    pts = [Point(i, (i * i) % 5) for i in range(5)]
    print(sum_points(pts))
```

```cs
using System;
using System.Collections.Generic;
using System.Linq;

var points = Enumerable.Range(0, 5)
    .Select(i => new Point(i, (i * i) % 5));
Console.WriteLine($"Total = {Sum(points)}");

static Point Sum(IEnumerable<Point> pts)
    => pts.Aggregate(new Point(0, 0), (acc, p) => acc + p);

// immutable value object
public readonly record struct Point(double X, double Y)
{
    public static Point operator +(Point a, Point b) => new(a.X + b.X, a.Y + b.Y);
}
```

```go
package main

import "fmt"

// Point is a simple 2-D vector
type Point struct{ X, Y int }

func (p Point) Add(o Point) Point { return Point{p.X + o.X, p.Y + o.Y} }

func Sum(ps []Point) (t Point) {
	for _, p := range ps { t = t.Add(p) }
	return
}

func main() {
	pts := make([]Point, 5)
	for i := range pts { pts[i] = Point{i, (i * i) % 5} }
	fmt.Printf("Total = %+v\n", Sum(pts))
}
```

# h1見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

## h2見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

### h3見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

#### h4見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

##### h5見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

###### h6見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

# 長いセクションの名前を出してみましょう

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890


[^1]: ここに脚注を書きます
