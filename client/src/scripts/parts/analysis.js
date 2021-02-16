import $ from 'jquery';
import {
    getReport
} from "./todolist/model";

function drawChart(chartData) {
    const {
        today,
        lastDay,
        weekReportData
    } = chartData;

    var data = google.visualization.arrayToDataTable(weekReportData);

    var options = {
        chart: {
            title: today + " ~ " + lastDay,
        },
        titleTextStyle: {
            color: '#FFFFFF',
        },
        chartArea: {
            backgroundColor: {
                fill: '#30402F',
                fillOpacity: 0.1
            },
        },
        bars: 'vertical',
        vAxis: {
            minValue: 0,
            textStyle: { color: '#FFFFFF' }
        },
        hAxis: {
            textStyle: { color: '#FFFFFF' },
        },
        legend: { position: 'none' },
        width: 500,
        height: 400,
        backgroundColor: {
            'fill': '#30402F',
            'opacity': 100
        },
        colors: ['#6C9461'],
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

async function init() {
    const reportData = await getReport();
    $("#today-total").html(reportData.data.todayReport.createdTotal);
    $("#today-completed").html(reportData.data.todayReport.completedTotal);
    $("#week-total").html(reportData.data.weeklyReport.createdTotal);
    $("#week-completed").html(reportData.data.weeklyReport.completedTotal);

    const year = new Date().getFullYear();
    const dailyReportData = reportData.data.dailyReport;

    let weekReportDateList = [];
    let weekReportData = [
        ['date', 'number'],
    ];
    let roundKey = 0;
    const totalNum = dailyReportData.length;
    dailyReportData.forEach((data) => {
        roundKey++;
        // week report date
        weekReportDateList.push(data.date);

        weekReportData.push([
            data.date,
            data.completedTotal,
        ]);
    });

    let today = "";
    if (weekReportDateList.length > 0) {
        today = year + '/' + weekReportDateList.shift();
    }

    let lastDay = "";
    if (weekReportDateList.length > 0) {
        lastDay = year + '/' + weekReportDateList.pop();
    }

    $("#today-text").html(today);
    google.charts.load('current', { packages: ['bar'] });
    google.charts.setOnLoadCallback(() => {
        drawChart({
            today: today,
            lastDay: lastDay,
            weekReportData: weekReportData,
        })
    });
}

export {
    init
};
