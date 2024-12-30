export const style = `
svg {
  color: black;
  font-family: "Times New Roman", serif;
}

line, path {
  stroke: rgb(0,0,0);
}

.title {
  font-size: 22px;
}

.composer, .capo, .tuning {
  font-size: 10px;
}

line.staffline {
  stroke-width: 0.4px;
}

line.barline {
  stroke-width: 1.3px;
}

path.fancy-line-main {
  stroke-width: 2.5px;
}

path.fancy-line-curl {
  stroke-width: 0.1px;
}

.flip {
  transform: scale(0.1,-0.1);
}

.measure-number {
  font-size: 7px;
}

.capo-change {
  font-size: 7px;
}

.comment {
  font-size: 7px;
}

.measure-barline {
  stroke-width: 0.7px;
}

.repeat-main-bar {
  stroke-width: 2.2px;
}

.ending-lines {
  stroke-width: 0.5px;
}

.ending-text {
  font-size: 6px;
}

.fret-number, .fret-number-grace {
  font-family: "Arial";
  font-weight: bold;
}

.fret-number {
  font-size: 6px;
}

.fret-number-grace {
  font-size: 4.5px;
}

.fret-number-square {
  stroke-opacity: 0;
}

.half-whole-rest, .quarter-rest, .eighth-rest, .rest-curl {
  stroke-width: 0.001px;
}

.eighth-rest {
  transform: scale(0.00075, -0.00075);
}

.sixteenth-rest {
  transform: scale(0.0006, -0.0006);
}

.thirtysecond-rest {
  transform: scale(0.00073, -0.00073);
}

.sixtyfourth-rest {
  transform: scale(0.0009, -0.0009)
}

.tuplet-bracket {
  stroke-width: 0.4px;
}

.tuplet-bracket-text {
  font-size: 5px;
}

.beam-stem-grace {
  stroke-width: 0.5px;
}

.beam-stem {
  stroke-width: 0.7px;
}

.grace-slash {
  stroke-width: 0.4px;
}

.beam {
  stroke-width: 1.6px;
}

.beam-grace {
  stroke-width: 1.1px;
}

.flag {
  transform: scale(0.00062,-0.00062);
}

.flag-grace {
  transform: scale(0.00048, -0.00048);
}

.grace-curve {
  stroke-width: 0.7px;
  fill: transparent;
}

.slur {
  stroke-width: 0.7px;
  fill: transparent;
}

.slur-grace {
  stroke-width: 0.5px;
  fill: transparent;
}

.strum {
  stroke-width: 0.45px;
  fill: black;
}

.strum-grace {
  stroke-width: 0.35px;
  fill: black;
}

.pluck {
  stroke-width: 0.1px;
  fill: black;
}

.pluck-grace {
  stroke-width: 0.1px;
  fill: black;
}

.palm-mute {
  font-size: 7px;
  font-weight: bold;
}

.long-palm-mute {
  stroke-width: 0.5px;
  fill: transparent;
}

.slide {
  stroke-width: 0.3px;
  fill: transparent;
}

.tie, .hammer {
  stroke-width: 0.6px;
  fill: transparent;
}

.parens {
  font-size: 6px;
}

.parens-grace {
  font-size: 4.5px;
}

.harmonic {
  stroke-width: 0.5px;
  fill: transparent;
}
`
