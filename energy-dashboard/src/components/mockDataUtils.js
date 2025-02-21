export const generateTimeSeriesData = (startYear, endYear, baseValue, volatility) => {
    const years = [];
    const values = [];
    let currentValue = baseValue;
  
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
      // إضافة تغيير عشوائي للقيمة
      currentValue += (Math.random() - 0.5) * volatility;
      // التأكد من أن القيمة لا تقل عن صفر
      currentValue = Math.max(0, currentValue);
      values.push(Number(currentValue.toFixed(2)));
    }
  
    return years.map((year, index) => ({
      year,
      value: values[index]
    }));
  };
  
  // دالة لتوليد بيانات الرسم البياني الدائري
  export const generatePieChartData = () => {
    const energyTypes = [
      'Solar',
      'Wind',
      'Hydro',
      'Nuclear',
      'Coal',
      'Natural Gas'
    ];
  
    let remaining = 100;
    return energyTypes.map((type, index) => {
      if (index === energyTypes.length - 1) {
        return { name: type, value: Number(remaining.toFixed(2)) };
      }
      const value = Number((Math.random() * (remaining / 2)).toFixed(2));
      remaining -= value;
      return { name: type, value };
    });
  };
  
  // دالة لمحاكاة API للحصول على بيانات الدولة
  export const mockCountryAPI = async (countryName) => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // توليد بيانات مختلفة لكل نوع من الطاقة
    const solarData = generateTimeSeriesData(2000, 2023, 20, 5);
    const windData = generateTimeSeriesData(2000, 2023, 15, 4);
    const hydroData = generateTimeSeriesData(2000, 2023, 30, 3);
    const renewableVsNon = generateTimeSeriesData(2000, 2023, 40, 6);
    const consumptionTrend = generateTimeSeriesData(2000, 2023, 100, 10);
    const consumptionPie = generatePieChartData();
  
    return [
      solarData,
      windData,
      hydroData,
      renewableVsNon,
      consumptionTrend,
      consumptionPie
    ];
  };