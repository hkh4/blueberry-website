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

.fret-number, .fret-number-grace {
  font-family: "Arial";
  font-weight: bold;
}

.fret-number {
  font-size: 5.5px;
}

.fret-number-grace {
  font-size: 4px;
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

`
