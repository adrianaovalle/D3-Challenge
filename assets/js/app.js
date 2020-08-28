// @TODO: YOUR CODE HERE!

// 1- Set Up the Chart------------------------------------------------------------------------
const svgWidth=960;
const svgHeight=700;

const margin={
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

const width=svgWidth-margin.left-margin.right-20;
const height=svgHeight-margin.top-margin.bottom -20;

//2- Creat an SVG wrapper---------------------------------------------------------------------
const svg=d3
        .select ("#scatter")
        .append ("svg")
        .attr("width", svgWidth)
        .attr ("height", svgHeight);

//Append an SVG group
const chartGroup=svg.append('g')
        .attr("transform",`translate(${margin.left},${margin.top})`);

// Initial Parameters
let chosenXAxis = "income";
let chosenYAxis = "healthcare";

//2- Function used for updating x-scale var upon click on axis label--------------------------
function xScale(data, chosenXAxis){
    //Create Scales
    const xLinearScale=d3.scaleLinear()
                        .domain(d3.extent(data,d=>d[chosenXAxis]))
                        .range([0,width]);
    return xLinearScale;
}

//3- Function used for updating y-scale var upon click on axis label--------------------------
function yScale(data, chosenYAxis){
    //Create Scales
    const yLinearScale=d3.scaleLinear()
                        .domain(d3.extent(data,d=>d[chosenYAxis]))
                        .range([height,0]);
    return yLinearScale;
}

// 4. function used for updating xAxis upon click on this axis--------------------------------
function renderXAxis (newXScale, xAxis){
    const bottomAxis=d3.axisBottom (newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// 5.function used for updating yAxis upon click on this axis---------------------------------
function renderYAxis (newYScale, yAxis){
    const leftAxis=d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

//6.function used for updating circles group with transition to new circles in x--------------
function renderXCircles (circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
                .duration (1000)
                .attr('cx', d=>newXScale(d[chosenXAxis]));
    return circlesGroup;
}

//7.function used for updating circles group with transition to new circles in y--------------
function renderYCircles (circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
                .duration (1000)
                .attr('cy', d=>newYScale(d[chosenYAxis]));
    return circlesGroup;
}

//8.function used for updating circles group with new tooltip---------------------------------
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty %:"
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age Median:"
    }
    else {
      xlabel = "Income:";
    }
  
  
    if (chosenYAxis === "obesity") {
      ylabel = "Obese %::"
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokers %:"
    }
    else {
      ylabel = "No Healthcare %:"
    }
  
    const toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>${d.state}</strong><br>
                ${xlabel} ${d[chosenXAxis]}<br>
                ${ylabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


//9. function to update text within circles---------------------------------------------------
function renderXCircleText(textCircles, newXScale, chosenXAxis) {

    textCircles.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textCircles;
  }
  
  function renderYCircleText(textCircles, newYScale, chosenYAxis) {
  
    textCircles.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis])+4);
  
    return textCircles;
  }
  

//10. Retrieve data from CSV file and execute everything below--------------------------------
d3.csv('assets/data/data.csv').then(function (stateData, err){
    if (err)throw err;
    console.log(stateData);

    // Parse Data
    stateData.forEach(function (data){
        data.poverty=+data.poverty;
        data.ageMoe=+data.age;
        data.incomeMoe=+data.incomeMoe;
        data.obesity=+data.obesity;
        data.smokes=+data.smokes;
        data.healthcare=+data.healthcare;
        console.log(data.poverty);
    console.log(data.age);
    console.log(data.incomeMoe);
    console.log(data.obesity);
    console.log(data.smokes);
    console.log(data.healthcare);
    });

    //LinearScale functions for csv import
    let xLinearScale=xScale(stateData,chosenXAxis);
    let yLinearScale=yScale(stateData,chosenYAxis);

    //Create initial axis functions
    const bottomAxis=d3.axisBottom(xLinearScale);
    const leftAxis=d3.axisLeft(yLinearScale);

    //append x axis
    let xAxis=chartGroup.append('g')
        .classed('x-axis',true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

    //append y axis
    let yAxis=chartGroup.append('g')
        .classed('y-axis',true)
        .call(leftAxis);

    //append initial circles
    let circlesGroup=chartGroup.append('g')
        .selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr('cx',d=>xLinearScale(d[chosenXAxis]))
        .attr('cy',d=>yLinearScale(d[chosenYAxis]))
        .attr('r', 12)
        .attr('fill', 'blue')
        .attr('opacity','.5');
    
    //append text to circles
    let textCircles=chartGroup.append('g')
        .selectAll('text')
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr('x',d=>xLinearScale(d[chosenXAxis]))
        .attr('y',d=>yLinearScale(d[chosenYAxis])+4)
        .attr("font-family", "Tahoma")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .style("fill", "white")
        .attr("font-weight", "bold");
    
    //Create group for three x-axis labels
    const xlabelsGroup=chartGroup.append('g')
        .attr("transform",`translate(${width/2},${height+30})`)
        .attr("font-family", "Tahoma")
        .attr("font-size", "15px");

    
    const povertyLabel=xlabelsGroup.append('text')
        .attr('x',0)
        .attr('y', 20)
        .attr('value','poverty')
        .classed('inactive',true)
        .text('In Poverty (%)');
    
    const ageLabel=xlabelsGroup.append('text')
    .attr('x',0)
    .attr('y', 45)
    .attr('value','age')
    .classed('inactive',true)
    .text('Age (Median)');

    const incomeLabel=xlabelsGroup.append('text')
    .attr('x',0)
    .attr('y', 70)
    .attr('value','income')
    .classed('active',true)
    .text('Household Income (Median)');

    //Create group for three y-axis labelss
    const ylabelsGroup=chartGroup.append('g')
    .attr("transform", "rotate(-90)")
    .attr("font-family", "Tahoma")
    .attr("font-size", "15px");

    const obesityLabel=ylabelsGroup.append('text')
    .attr('x',0 - (height/2))
    .attr('y', 0-margin.left +15)
    .attr('value','obesity')
    .classed('inactive',true)
    .text('Obese (%)');

    const smokeLabel=ylabelsGroup.append('text')
    .attr('x',0 - (height/2))
    .attr('y', 0-margin.left +40)
    .attr('value','smokes')
    .classed('inactive',true)
    .text('Smokers (%)');

    const healthcareLabel=ylabelsGroup.append('text')
    .attr('x',0 - (height/2))
    .attr('y', 0-margin.left +65)
    .attr('value','healthcare')
    .classed('active',true)
    .text('No Healthcare (%)');

    //update Tooltip function
    circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
    
    //x-axis labels event listener
    xlabelsGroup.selectAll('text')
        .on('click',function(){
            const xvalue=d3.select(this).attr('value');
            if (xvalue!==chosenXAxis){
                chosenXAxis=xvalue;
                xLinearScale=xScale(stateData,chosenXAxis);
                xAxis=renderXAxis(xLinearScale,xAxis);
                circlesGroup=renderXCircles(circlesGroup,xLinearScale,chosenXAxis);
                textCircles = renderXCircleText(textCircles, xLinearScale, chosenXAxis);
                circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
                if (chosenXAxis==="poverty"){
                    povertyLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomeLabel
                        .classed("active",false)
                        .classed("inactive",true);
                }
                else if (chosenXAxis==="age"){
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    ageLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    incomeLabel
                        .classed("active",false)
                        .classed("inactive",true);
                }
                else{
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomeLabel
                        .classed("active",true)
                        .classed("inactive",false);
                }
            }
        })
    
      //y-axis labels event listener
      ylabelsGroup.selectAll('text')
      .on('click',function(){
          const yvalue=d3.select(this).attr('value');
          if (yvalue!==chosenYAxis){
              chosenYAxis=yvalue;
              yLinearScale=yScale(stateData,chosenYAxis);
              yAxis=renderYAxis(yLinearScale,yAxis);
              circlesGroup=renderYCircles(circlesGroup,yLinearScale,chosenYAxis);
              textCircles = renderYCircleText(textCircles, yLinearScale, chosenYAxis);
              circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
            if (chosenYAxis==="obesity"){
                obesityLabel
                    .classed("active",true)
                    .classed("inactive",false);
                smokeLabel
                    .classed("active",false)
                    .classed("inactive",true);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
            }
            else if (chosenYAxis==="smokes"){
                obesityLabel
                    .classed("active",false)
                    .classed("inactive",true);
                smokeLabel
                    .classed("active",true)
                    .classed("inactive",false);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
            }
            else{
                obesityLabel
                    .classed("active",false)
                    .classed("inactive",true);
                smokeLabel
                    .classed("active",false)
                    .classed("inactive",true);
                healthcareLabel
                    .classed("active",true)
                    .classed("inactive",false);
            }
          }
      })
    
})


