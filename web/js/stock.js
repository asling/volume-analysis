var upColor = '#00da3c';
var downColor = '#ec0000';

const queryObj = getURLParams(window.location.href);
function random(){
    let p;
    if(Math.round(Math.random()) === 0){
        p = -1;
    }else{
        p = 1;
    }
    return p * Math.round(Math.random()*5);
}
function splitData(oldData,rawData) {
    var categoryData = [];
    var values = [];
    var rocs = [];
    for (var i = 0; i < rawData.length; i++) {
        if(rawData[i]){
            categoryData.push(rawData[i]['date']);
            values.push([rawData[i]['open'],rawData[i]['close'],rawData[i]['lowest'],rawData[i]['highest']]);
            rocs.push(rawData[i]['rocs']);
        }
        
    }
    if(oldData){
        return {
            categoryData: [
                ...oldData.categoryData,
                ...categoryData,
                ],
            values:[
                ...oldData.values,
                ...values,
            ],
            rocs: [
                ...oldData.rocs,
                ...rocs,
            ]
        };
    }else{
        return {
            categoryData: categoryData,
            values: values,
            rocs: rocs
        };
    }
    
}

function initChart(){
    return echarts.init(document.getElementById('main'));
}

function renderChart(myChart,data){
    var option = {
                backgroundColor: '#21202D',
                legend: {
                    data: ['日K'],
                    inactiveColor: '#777',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                        type: 'cross',
                        lineStyle: {
                            color: '#376df4',
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: data.categoryData,
                    boundaryGap : false,
                    axisLine: { lineStyle: { color: '#777' } },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        show: true
                    }
                }, {
                    type: 'category',
                    gridIndex: 1,
                    data: data.categoryData,
                    scale: true,
                    boundaryGap : false,
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: '#777' } },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                    // axisPointer: {
                    //     type: 'shadow',
                    //     label: {show: false},
                    //     triggerTooltip: true,
                    //     handle: {
                    //         show: true,
                    //         margin: 30,
                    //         color: '#B80C00'
                    //     }
                    // }
                }],
                yAxis: [{
                    scale: true,
                    axisLine: { lineStyle: { color: '#8392A5' } },
                    splitLine: { show: false }
                },{
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false}
                }],
                grid: [{
                    left: 20,
                    right: 20,
                    top: 110,
                    height: 120
                }, {
                    left: 20,
                    right: 20,
                    height: 40,
                    top: 260
                }],
                dataZoom: [{
                    textStyle: {
                        color: '#8392A5'
                    },
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    xAxisIndex: [0, 1],
                    dataBackground: {
                        areaStyle: {
                            color: '#8392A5'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#8392A5'
                        }
                    },
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }, {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                }],
                animation: false,
                series: [
                        {
                        name: 'Rocs',
                        type: 'line',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#7fbe9e'
                            },
                            emphasis: {
                                color: '#140'
                            }
                        },
                        data: data.rocs
                    },
                    {
                        type: 'candlestick',
                        name: '日K',
                        data: data.values,
                        itemStyle: {
                            normal: {
                                color: '#FD1050',
                                color0: '#0CF49B',
                                borderColor: '#FD1050',
                                borderColor0: '#0CF49B'
                            }
                        }
                    }
                ]
            };

        myChart.setOption(option);
}

if(!queryObj.stockNum || !queryObj.range){
    alert("参数错误，请增加stockNum和range数值");
}else{
    let page = 1;
    let totalPage;
    let data = null; 
    const myChart = initChart();
    $.ajax(`/stock/${queryObj.stockNum}/range/${queryObj.range}/page/${page}`,{
        async:false,
        dataType: 'json',
        success: function(rawData){
            if(!rawData || !rawData.data || parseInt(rawData.totalNum) <= 0) return false;   
            data = splitData(data,rawData.data);
            const pageSize = rawData.pageSize;
            totalPage = Math.ceil(parseInt(rawData.totalNum) / pageSize);
            renderChart(myChart,data);
            $("#loading").remove();
            $("#name").text(rawData.name);
            page++;
        }
    });


    while(page<=totalPage){
        console.log("page",page);
        console.log("totalPage1",totalPage);
        $.ajax(`/stock/${queryObj.stockNum}/range/${queryObj.range}/page/${page}`, {
            async: false,
            dataType: 'json',
            success: function(rawData){
                if(!rawData || !rawData.data || parseInt(rawData.totalNum) <= 0) return false;   
                data = splitData(data,rawData.data);
                renderChart(myChart,data);
            }
        });
        page++;
    }
    
}

