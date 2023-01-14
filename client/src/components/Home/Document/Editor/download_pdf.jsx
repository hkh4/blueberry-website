import jsPDF from "jspdf"

// Download as a pdf
export default async function downloadPDF(previewRef, title) { 

    try {

      // Get the preview box
      const previewBox = previewRef.current
      // The actual SVGs within
      const children = Array.from(previewBox.children)

      // Initialize the doc
      const doc = new jsPDF({
        unit: "px",
        format: [612, 792],
        compress: true
      })
      doc.deletePage(1)

      // Loop through each page
      await Promise.all(children.map(async (child) => {

        // Get the canvas
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Set the background to be white
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Turn the svg code into a string that can be used later when making the image
        const data = (new XMLSerializer()).serializeToString(child);
        const DOMURL = window.URL || window.webkitURL || window;

        // Initialize the new image and pass the serialized data to a Blob
        const img = new Image();
        const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        const url = DOMURL.createObjectURL(svgBlob);

        img.src = url;

        // Once the image loads, draw on it
        return new Promise((resolve, reject) => {
          img.onload = function() {

            ctx.drawImage(img, 0, 0);

            const imgURI = canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream');

            // Create a new page on the pdf
            doc.addPage()

            // Draw the image on the new pdf page
            doc.addImage(imgURI, "PNG", 0, 0, 612, 792, '', 'FAST')

            // Clear the canvas for the next page
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Resolve this promise
            resolve()
          };
        })

      }))

      doc.save(`${title}.pdf`)

    } catch(e) {
      console.log(e)
    }

  }