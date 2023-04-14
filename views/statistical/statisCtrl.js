app.controller("statisCtrl", function ($rootScope, $scope, $http) {
  $scope.loading = false;
  $scope.customTotal = 0;
  $scope.customTotal1 = 0;
  $scope.loading = false;
  $rootScope.charts1 = [];
  $scope.initialize = function () {
    $scope.loading = true;
    $scope.getTopRoom();
    $scope.getTotals();
    $scope.getTotals1();
    $scope.getTopRoomType();
    $scope.getTopSer();
  }

  function drawChart() {
    $http.get('http://localhost:8000/api/statistical/google-chart')
      .then(function (response) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Tuần này');
        data.addColumn('number', 'Standard');
        data.addColumn('number', 'Superior');
        data.addColumn('number', 'Deluxe');
        data.addColumn('number', 'Suite');

        var labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (var i = 0; i < response.data.length; i++) {
          var row = response.data[i];
          data.addRow([labels[i], row[1], row[2], row[3], row[4]]);
        }
        var options = {
          chart: {
            title: 'Sơ đồ tăng trưởng của loại phòng',
          },
          height: 400,
          axes: {
            x: {
              0: { side: 'top' }
            }
          }
        };
        var chart = new google.charts.Line(document.getElementById('line_top_x'));

        chart.draw(data, google.charts.Line.convertOptions(options));

      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  }
  google.charts.load('current', { 'packages': ['line'] });
  google.charts.setOnLoadCallback(drawChart);


  $scope.exportToExcel = function() { //xuat excel
    $http.get('http://localhost:8000/api/statistical/excel')
      .then(function(response) {
        var data = response.data;
        var sheetData = [
          ['Room Type', 'Total Booked', 'Total Revenue']
        ];
        angular.forEach(data, function(row) {
          sheetData.push([row[0], row[1], row[2]]);
        });
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
          return buf;
        }
        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'statistical_report.xlsx');
      })
      .catch(function(error) {
        console.log('Error:', error);
      });
  };

  $scope.getTotals = function () { // thong ke money day-week-month
    $http.get('http://localhost:8000/api/invoices/totals')
      .then(function (response) {
        $scope.totals = response.data;
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  };

  $scope.getTotals1 = function () { // thong ke booked day-week-month
    $http.get('http://localhost:8000/api/statistical/totals')
      .then(function (response) {
        $scope.totals1 = response.data;
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  };

  $scope.getTopRoom = function () { // thong ke top room
    $http.get('http://localhost:8000/api/statistical/rooms/top')
      .then(function (response) {
        $scope.statisticalData = response.data;
      }, function (error) {
        console.log(error);
      });

  };

  $scope.getTopRoomType = function () { // thong ke top roomType
    $http.get('http://localhost:8000/api/statistical/type/top')
      .then(function (response) {
        $scope.statisticalData1 = response.data;
      }, function (error) {
        console.log(error);
      });

  };

  $scope.getTopSer = function () { // thong ke top Service
    $http.get('http://localhost:8000/api/statistical/ser/top')
      .then(function (response) {
        $scope.statisticalData2 = response.data;
        $scope.loading = false;
      }, function (error) {
        console.log(error);
      });

  };

  $scope.getByDate = function () { // thong ke start-end
    var myDateInput = document.getElementById("myDate");
    var myDateInput1 = document.getElementById("myDate1");
    var today = new Date();
    if (myDateInput.value == "" || myDateInput.value == "") {
      alert('Hãy chọn ngày bắt đầu, kết thúc!.');
      return
    } else if (myDateInput1.value < myDateInput.value) {
      alert('Ngày kết thúc phải sau ngày bắt đầu.');
      return
    } else {
      $scope.loading = true;
      $http.get('http://localhost:8000/api/invoices/byDate/' + myDateInput.value + "/" + myDateInput1.value)
        .then(function (response) {
          $scope.loading = false;
          $scope.customTotal = response.data;
        })
        .catch(function (error) {
          $scope.loading = false;
          console.log('Error:', error);
        });
      $http.get('http://localhost:8000/api/statistical/byDate/' + myDateInput.value + "/" + myDateInput1.value)
        .then(function (response) {
          $scope.loading = false;
          $scope.customTotal1 = response.data;
        })
        .catch(function (error) {
          $scope.loading = false;
          console.log('Error:', error);
        });
    }
  };

  $scope.initialize()
});