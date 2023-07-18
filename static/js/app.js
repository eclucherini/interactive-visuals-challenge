// Create url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Display default plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // A list of id names
        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            // This is adding each name to the html file as an option element with value = a name in the names array
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        demographicsInfo(name);
        barChart(name);
        bubbleChart(name)
    });
}

// Create the demographics panel
function demographicsInfo(selectedValue) {

    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Retrieve metadata
        let metadata = data.metadata;
        
        // Filter based on the value of the sample
        let filteredData = metadata.filter(result => result.id == selectedValue);
      
        // Assign the first object to object variable
        let object = filteredData[0]
        
        // Clear out metadata
        d3.select("#sample-metadata").html("");
  
        // Use Object.entries to add each key/value pair to the panel
        let entries = Object.entries(object);
        
        // Iterate through the entries array
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries array
        console.log(entries);
    });
  }
  

// Create the bar chart function
function barChart(selectedValue) {

    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Create array of sample objects
        let samples = data.samples;

        // Filter based on the value of the sample
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign the first index from the array to the object variable
        let object = filteredData[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = object.otu_ids;
        let otu_labels = object.otu_labels;
        let sample_values = object.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};
  
// Create the bubble chart function
function bubbleChart(selectedValue) {

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {

        // Create array of sample objects
        let samples = data.samples;
    
        // Filter based on the value of the sample
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign the first index from the array to the object variable
        let object = filteredData[0];
        
        // Get the otu_ids, lables, and sample values
        let otu_ids = object.otu_ids;
        let otu_labels = object.otu_labels;
        let sample_values = object.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demographicsInfo(selectedValue);
    barChart(selectedValue);
    bubbleChart(selectedValue)
}

init();