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
  transform: scaleY(-1);
}

`
