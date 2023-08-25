const extractJSONFromHTML = async (url) => {
  if (!url) {
    throw new Error('URL undefined');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An HTTP-Error has occurred: ${response.status} ${response.statusText}`);
  }

  const str = await response.text();
  const startTag = '<script id="__NEXT_DATA__" type="application/json">';
  const start = str.indexOf(startTag) + startTag.length;
  const end = str.indexOf('</script>', start);

  return JSON.parse(str.substring(start, end));
};

const getListings = async (url) => {
  const result = await extractJSONFromHTML(url);

  if (!result?.props?.pageProps?.searchResult?.advertSummaryList?.advertSummary) {
    throw new Error('Unexpected JSON structure');
  }

  return result.props.pageProps.searchResult.advertSummaryList.advertSummary.map((element) => {
    const attributes = {};
    element.attributes.attribute.forEach((attr) => {
      const [val] = attr.values;
      attributes[attr.name.toLowerCase()] = Number.isNaN(Number(val)) ? val : +val;
    });

    return {
      property_type: attributes.property_type,
      state: attributes.state,
      district: attributes.district,
      postcode: attributes.postcode,
      location: attributes.location,
      number_of_rooms: attributes.number_of_rooms,
      price: Number.isNaN(attributes.price) ? null : attributes.price,
      estate_size: attributes.estate_size,
      isprivate: attributes.isprivate,
    };
  });
};

const getMetadata = async (url) => {
  const result = await extractJSONFromHTML(url);

  if (!result?.props?.pageProps?.searchResult) {
    throw new Error('Unexpected JSON structure');
  }

  return result.props.pageProps.searchResult;
};

export { getListings, getMetadata };
