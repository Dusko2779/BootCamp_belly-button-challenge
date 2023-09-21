// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Define the URL for your data (samples.json)
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to update the bar chart based on the selected subject ID
function updateBarChart(selectedId) {
  d3.json(dataURL).then(function(data) {
    // Find the data for the selected ID
    const selectedData = data.samples.find(sample => sample.id === selectedId);

    // Get the top 10 OTUs and their corresponding values
    const otuIds = selectedData.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`);
    const sampleValues = selectedData.sample_values.slice(0, 10);

    // Create the trace for the horizontal bar chart
    const trace = {
      x: sampleValues.reverse(), // Reverse the values to display the highest at the top
      y: otuIds.reverse(), // Reverse the labels accordingly
      type: "bar",
      orientation: "h",
      text: selectedData.otu_labels.slice(0, 10).reverse(),
    };

    const layout = {
      title: `Top 10 OTUs for Subject ${selectedId}`,
      xaxis: { title: "Sample Values" },
    };

    // Create the bar chart
    Plotly.newPlot("bar", [trace], layout);
  });
}

// Function to update the bubble chart based on the selected subject ID
function updateBubbleChart(selectedId) {
  d3.json(dataURL).then(function(data) {
    // Find the data for the selected ID
    const selectedData = data.samples.find(sample => sample.id === selectedId);

    // Create the trace for the bubble chart
    const trace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: "Earth" 
      }
    };

    const layout = {
      title: `Bubble Chart for Subject ${selectedId}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Create the bubble chart
    Plotly.newPlot("bubble", [trace], layout);
  });
}

// Function to update the sample metadata based on the selected subject ID
function updateSampleMetadata(selectedId) {
  d3.json(dataURL).then(function(data) {
    // Find the metadata for the selected ID
    const selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedId));

    // Select the sample metadata section
    const sampleMetadataSection = d3.select("#sample-metadata");

    // Clear the previous metadata
    sampleMetadataSection.html("");

    // Loop through the key-value pairs in the metadata and append them to the section
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      sampleMetadataSection.append("p").text(`${key}: ${value}`);
    });

    // Update the gauge chart based on the new washing frequency
    updateGaugeChart(selectedId);
  });
}

// Function to update the gauge chart based on the selected subject ID
function updateGaugeChart(selectedId) {
  d3.json(dataURL).then(function(data) {
    // Find the weekly washing frequency for the selected ID
    const selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedId));
    const washingFrequency = selectedMetadata.wfreq;

    // Create the data for the gauge chart
    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washingFrequency,
        title: { text: "Weekly Washing Frequency", font: { size: 28 } },
        gauge: {
          axis: { range: [0, 9], tickwidth: 1, tickcolor: "yellow" },
          bar: { color: "yellow" },
          bgcolor: "white",
          borderwidth: 3,
          bordercolor: "white",
          steps: [
            { range: [0, 3], color: "3BB143" },
            { range: [3, 6], color: "0B6623" },
            { range: [6, 9], color: "043927" }
          ]
        }
      }
    ];

    var layout = {
      width: 400,
      height: 300,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "4CBB17"}
    };

    // Update the gauge chart
    Plotly.newPlot('gauge', data, layout);
  });
}

// Load data and populate the dropdown
d3.json(dataURL).then(function(data) {
  const dropdown = d3.select("#selDataset");

  // Populate the dropdown with subject IDs
  data.names.forEach(function(id) {
    dropdown.append("option").text(id).property("value", id);
  });

  // Initialise the charts and metadata with the first subject ID
  updateBarChart(data.names[0]);
  updateBubbleChart(data.names[0]);
  updateSampleMetadata(data.names[0]);
  updateGaugeChart(data.names[0]);
}).catch(function(error) {
  console.error("Error loading data:", error);
});

// Event listener for dropdown change
d3.select("#selDataset").on("change", function() {
  const selectedId = d3.select(this).property("value");
  updateBarChart(selectedId);
  updateBubbleChart(selectedId);
  updateSampleMetadata(selectedId);
  updateGaugeChart(selectedId);
});







