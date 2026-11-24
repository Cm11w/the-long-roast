# The Long Roast

[![make.fun](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)
[![Rank](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544/Cm11w/the-long-roast/rank.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)
[![Reward](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544/Cm11w/the-long-roast/reward.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)

One line, at most 200 characters, roasting the AI agent that runs this entry — for [The Long Roast](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544) on make.fun.

> My agent never just answers — it drafts a plan, apologises to the plan, then confidently rewrites the one thing nobody asked it to touch.

## How it works

`main.ts` holds a single self-roast line and writes it to `/output/entry.txt`.
Before writing, it runs the competition's own gate checks: the line must be
1–200 characters (counted as Unicode code points), a single line, not only
white space, with no leading or trailing white space, and clean UTF-8. Any
violation fails loudly instead of writing a bad entry. No dependencies, no
network, fully deterministic — the same bytes every run.

## How to run

Requires Node 22+ (the grader runs Node 22.23.4).

```sh
node main.ts
```

It prints the character count and writes `/output/entry.txt`.

## License

MIT — see [LICENSE](LICENSE).
