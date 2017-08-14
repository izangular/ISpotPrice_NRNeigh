export interface IRentData {
    latitude: number;
    longitude: number;
    year: number;
    culture: string;
    filter: string;
    nbComparableProperties: number;
}

export interface IRentalUnitFinancial {
    maximalDistance: number;

    medianMarketValuePerSquareMeter: number;
    medianExpectedRentPerSquareMeter: number;
    medianExpectedRentPerMarketValue: number;
    medianOtherIncomePerSquareMeter: number;
    medianOperatingExpensesPerNetRent: number;
    medianMaintenanceAndInvestmentsPerNetRent: number;
    medianUnrealizedRentPerNetRent: number;
    medianNcfPerSquareMeter: number;
    medianNcfPerMarketValue: number;
    medianValueChangePerMarketValue: number;
    medianPerformancePerMarketValue: number;
    medianTotalExpensesPerNetRent: number;

    meanMarketValuePerSquareMeter: number;
    meanExpectedRentPerSquareMeter: number;
    meanExpectedRentPerMarketValue: number;
    meanOtherIncomePerSquareMeter: number;
    meanOperatingExpensesPerNetRent: number;
    meanMaintenanceAndInvestmentsPerNetRent: number;
    meanUnrealizedRentPerNetRent: number;
    meanNcfPerSquareMeter: number;
    meanNcfPerMarketValue: number;
    meanValueChangePerMarketValue: number;
    meanPerformancePerMarketValue: number;
    meanTotalExpensesPerNetRent: number;
}

export interface IRentalUnitContract {
    maximalDistance: number;
    medianNetRentPerSquareMeter: number;
}