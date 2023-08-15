/* eslint-disable camelcase */
const getListings = async (url) => {
  if (!url) {
    throw new Error('URL undefined');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An HTTP-Error has been occured: ${response.status} ${response.statusText}`);
  }

  const str = await response.text();

  const temp = str.substring(str.indexOf('<script id="__NEXT_DATA__" type="application/json">') + '<script id="__NEXT_DATA__" type="application/json">'.length);
  const result = JSON.parse(temp.substring(0, temp.indexOf('</script>')));
  const returnArray = [];

  result.props.pageProps.searchResult.advertSummaryList.advertSummary.forEach((element) => {
    const tempElement = element;
    element.attributes.attribute.forEach((element2) => {
      const [val] = element2.values;
      // eslint-disable-next-line no-restricted-globals
      tempElement[element2.name.toLowerCase()] = isNaN(val) ? val : +val;
    });

    const picked = (({
      price,
      state,
      district,
      location,
      postcode,
      property_type,
      number_of_rooms,
      estate_size,
      isprivate,
    }) => ({
      property_type,
      state,
      district,
      postcode,
      location,
      number_of_rooms,
      price,
      estate_size,
      isprivate,
    }))(tempElement);

    if (isNaN(picked.price)) {
      picked.price = null;
    }

    returnArray.push(picked);
  });

  return returnArray;
};

const getMetadata = async (url) => {
  if (!url) {
    throw new Error('URL undefined');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An HTTP-Error has been occured: ${response.status} ${response.statusText}`);
  }

  const str = await response.text();

  const temp = str.substring(str.indexOf('<script id="__NEXT_DATA__" type="application/json">') + '<script id="__NEXT_DATA__" type="application/json">'.length);
  const result = JSON.parse(temp.substring(0, temp.indexOf('</script>')));

  return result.props.pageProps.searchResult;
};

export { getListings, getMetadata };
