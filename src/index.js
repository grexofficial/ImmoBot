import aggregatedModel from './aggregatedModel.js';
import { getListings, getMetadata } from './api.js';
import dataModel from './dataModel.js';
import db from './db.js';

await db();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const numberOfResults = +process.env.RESULTS_PER_PAGE || 200; // max possible number 200

try {
  // await getListings(`https://www.willhaben.at/iad/immobilien/eigentumswohnung?rows=${numberOfResults}&page=1`);
  const { rowsFound } = await getMetadata('https://www.willhaben.at/iad/immobilien/eigentumswohnung?rows=1&areaId=1&areaId=2&areaId=3&areaId=4&areaId=5&areaId=6&areaId=7&areaId=8&areaId=900'); // get number of results
  const pages = Math.ceil(rowsFound / numberOfResults); // calculate number of pages to iterate
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= pages; i++) {
    /* getListings(`https://www.willhaben.at/iad/immobilien/eigentumswohnung?rows=${numberOfResults}&page=${i}&areaId=1&areaId=2&areaId=3&areaId=4&areaId=5&areaId=6&areaId=7&areaId=8&areaId=900`).then(
      (result) => {
        dataModel.insertMany(result);
      },
    );

    // 1 sec. delay needed otherwise willhaben will terminate the request instantly
    await delay(1000); */
  }

  // aggregate rawData
  const aggregatedData = await dataModel.aggregate([
    {
      $group: {
        _id: { norooms: '$number_of_rooms', plz: '$postcode' },
        // b: { $push: '$$ROOT' }, // debug
        avgSize: { $avg: '$estate_size' },
        avgPrice: { $avg: '$price' },
        count: { $count: { } },
        countPrivateSeller: {
          $sum: { $toInt: '$isprivate' },
        },
        state: { $first: '$state' },
        location: { $first: '$location' },
        date: { $first: '$timestamp' },
      },
    },
    {
      $match: { '_id.plz': { $ne: null } },
    },
    {
      $sort: { '_id.norooms': 1 },
    },
    {
      $project: {
        _id: 0,
        plz: '$_id.plz',
        norooms: '$_id.norooms',
        avgSize: 1,
        avgPrice: 1,
        count: 1,
        countPrivateSeller: 1,
        relativeSharePrivateSeller: { $divide: ['$countPrivateSeller', '$count'] },
        state: 1,
        location: 1,
        date: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
      },
    },
  ]);

  // insert aggregated Data to aggregatedData collection
  // await aggregatedModel.insertMany(aggregatedData);

  // await dataModel.deleteMany({}); // remove all raw data
  console.log(aggregatedData);
} catch (error) {
  console.error(error);
}
