const csv = require('csvtojson')

module.exports = (csvString) => new Promise((resolve, reject) => {
  let years = []
  let rowIndex = 0
  let counties = []

  csv({noheader: true})
    .fromString(csvString)
    .on('csv', (csvRow) => {
      if(rowIndex === 0) {
        csvRow.forEach((cell, cellIndex) => {
          if(cell.length === 4) years.push({
              value: parseInt(cell),
              index: cellIndex
          })
        })
      } else if(rowIndex > 1) {
        let county = {};

        county.state = csvRow[0]
        county.fips = csvRow[1]
        county.name = csvRow[2]

        county.years = years.map((year) => ({
          year : year.value,
          number: csvRow[year.index],
          percent: csvRow[year.index + 1],
          lowerConfidenceLimit: csvRow[year.index + 2],
          upperConfidenceLimit: csvRow[year.index + 3],
          ageAjustedPercent: csvRow[year.index + 4],
          ageAjustedLowerConfidenceLimit: csvRow[year.index + 5],
          ageAjustedUpperConfidenceLimit: csvRow[year.index + 6]
        }))

        counties.push(county);
      }

      rowIndex++;
    })
    .on('done',(error) => {
      if(error) reject(error);
      resolve(counties);
    })
})
