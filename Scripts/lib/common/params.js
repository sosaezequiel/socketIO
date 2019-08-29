var LayoutAction = {
    LAYOUT_CHANGED: "LAYOUT_CHANGED",
    LAYOUT_OVERLAY_SHOW: "LAYOUT_OVERLAY_SHOW",
    LAYOUT_OVERLAY_HIDE: "LAYOUT_OVERLAY_HIDE",
    CONTAINER_CONSTRAINT_REACHED: "CONTAINER_CONSTRAINT_REACHED",
    CONTAINER_CONSTRAINT_RELEASED: "CONTAINER_CONSTRAINT_RELEASED",
    MODULE_ADDED: "MODULE_ADDED",
    MODULE_REMOVED: "MODULE_REMOVED",
    MODULE_POSITION_CHANGED: "MODULE_POSITION_CHANGED",
    MODULE_CONTAINER_CHANGED: "MODULE_CONTAINER_CHANGED",
    MODULE_RESIZED: "MODULE_RESIZED",
    MODULE_ACTIVATED_FIRST_TIME: "MODULE_ACTIVATED_FIRST_TIME",
    MODULE_ACTIVATED: "MODULE_ACTIVATED",
    MODULE_DEACTIVATED: "MODULE_DEACTIVATED",
    MODULE_IS_READY: "MODULE_IS_READY",
    MODULE_DETACHED: "MODULE_DETACHED",
    MODULE_ATTACHED: "MODULE_ATTACHED",
    MODULE_EXCLUDED: "MODULE_EXCLUDED"
};
Object.freeze(LayoutAction);

var ModulesType = {
    SUPPORT_MOBILE: "supportMobile",
    SUPPORT_BROWSER: "supportBrowser",
    LOGIN: "login",
    POPUPS: "popups",
    BOTTOMBAR: "bottombar",
    TOASTS: "toasts",
    TOOLBAR: "toolbar",
    MAIN: "main",
    MY_ACCOUNT: "myAccount",
    SETTINGS: "settings",
    SUMMARY: "summary",
    FAVORITE_SYMBOLS: "favoriteSymbols",
    MARKET_WATCH: "marketWatch",
    MARKET_WATCH_DEPTH: "marketWatchDepth",
    MARKET_ANALYSIS: "marketAnalysis",
    MARKET_SENTYMENTS: "marketSentiments",
    HEATMAP: "heatmap",
    HEATMAP_FOREX: "heatmapForex",
    HEATMAP_EQUITIES: "heatmapEquities",
    TOP_MOVERS: "topMovers",
    SCREENER: "screener",
    FUND_SELECTOR: "fundSelector",
    CHARTS: "charts",
    NEWS: "news",
    CALENDAR: "calendar",
    OPEN_TRADES: "openTrades",
    SYMBOL_INFO: "symbolInfo",
    REJECTED: "rejected",
    PENDING_TRADES: "pendingTrades",
    EDUCATION: "education",
    BASKETS: "baskets",
    HISTORY: "history",
    STATISTICS: "statistics",
    CLOSED_POSITIONS: "closedPositions",
    ORDERS_HISTORY: "ordersHistory",
    IB_LEDGER_HISTORY: "ibLedgerHistory",
    CASH_OPERATIONS: "cashOperations",
    CALENDAR_DIVIDEND: "calendarDividend",
    CALENDAR_ECONOMIC: "calendarEconomic",
    GARANTY: "Garanty",
    DEPTH: "Depth"
};
Object.freeze(ModulesType);
var EndpointType = {
    CFD: "CFD",
    BACK_OFFICE: "BackOffice",
    MAE: "MAE"
};

var ModulesEndpoint = {};
ModulesEndpoint[EndpointType.CFD] = [ModulesType.MARKET_WATCH, ModulesType.CHARTS, ModulesType.NEWS, ModulesType.CALENDAR, ModulesType.OPEN_TRADES, ModulesType.PENDING_TRADES, ModulesType.CLOSED_POSITIONS, ModulesType.MARKET_ANALYSIS, ModulesType.EDUCATION, ModulesType.SCREENER, ModulesType.MARKET_SENTYMENTS, ModulesType.TOP_MOVERS, ModulesType.HEATMAP, ModulesType.HEATMAP_FOREX, ModulesType.HEATMAP_EQUITIES, ModulesType.FUND_SELECTOR, ModulesType.HISTORY, ModulesType.ORDERS_HISTORY, ModulesType.IB_LEDGER_HISTORY, ModulesType.CASH_OPERATIONS, ModulesType.CALENDAR_DIVIDEND, ModulesType.CALENDAR_ECONOMIC];
ModulesEndpoint[EndpointType.MAE] = [ModulesType.MARKET_WATCH, ModulesType.MARKET_WATCH_DEPTH, ModulesType.CHARTS, ModulesType.SYMBOL_INFO, ModulesType.PENDING_TRADES, ModulesType.OPEN_TRADES, ModulesType.HISTORY, ModulesType.DEPTH, /*ModulesType.ORDERS_HISTORY, ModulesType.CLOSED_POSITIONS,*/ ModulesType.REJECTED, ModulesType.GARANTY];

Object.freeze(ModulesEndpoint);

var SymbolCategories = {
    FAVORITES: "PFF",
    PF1: "PF1",
    PF1: "PF2",
    PF1: "PF3",
};

var SkinType = {
    WHITE: "white",
    BLACK: "black",
    COMMON: "common",
    REPORT: "report",
    ARABIC: "arabic"
};

var DataEvent = {
    NEW: 0,
    UPDATED: 1,
    REMOVED: 2,
    EXIST: 3,
    NO_DATA: 4,
    ERROR: 5,
    ITEM_LIST: 6
};
Object.freeze(DataEvent);

var ScrollDimensions = {
    WIDTH: 12,
    HEIGHT: 12
};
Object.freeze(ScrollDimensions);

var DataProviderEvent = {
    ITEMS_LOADED: "DataProviderEvent.ItemsLoaded",
    ITEM_UPDATED: "DataProviderEvent.ItemUpdated"
};
Object.freeze(DataProviderEvent);

var GAPageView = {
    MAIN_TRADING: "Trading",
    MAIN_OTHER: "Other",
    CONTAINER_RIGHT: "Right_Container",
    CONTAINER_LEFT: "Left_Container",
    CONTAINER_BOTTOM: "Bottom_Container"
};
Object.freeze(GAPageView);

var StartupStep = {
    INIT_FIRST_SERVICES: "INIT_FIRST_SERVICES",
    CHECK_MOBILE: "CHECK_MOBILE",
    CHECK_BROWSER: "CHECK_BROWSER",
    INIT_WIDGET_SERVICE: "INIT_WIDGET_SERVICE",
    CHECK_CONFIG_IS_LOADED: "CHECK_CONFIG_IS_LOADED",
    INIT_COMMON_STYLE: "INIT_COMMON_STYLE",
    LOGIN: "LOGIN",
    LOAD_PACKAGE_APP: "LOAD_PACKAGE_APP",
    LOAD_PACKAGE_WIDGET: "LOAD_PACKAGE_WIDGET",
    UPDATE_CURRENT_ACCOUNT_DATA: "UPDATE_CURRENT_ACCOUNT_DATA",
    INIT_SERVICES_AFTER_LOGIN: "INIT_SERVICES_AFTER_LOGIN",
    MIGRATE_DESKTOP_SETTINGS: "MIGRATE_DESKTOP_SETTINGS",
    LOAD_SETTINGS_USER: "LOAD_SETTINGS_USER",
    SET_LANGUAGE: "SET_LANGUAGE",
    LOAD_SETTINGS_ACCOUNT: "LOAD_SETTINGS_ACCOUNT",
    LOAD_SKIN: "LOAD_SKIN",
    INIT_SERVICES_ENDPOINT: "INIT_SERVICES_ENDPOINT",
    INIT_SERVICES: "INIT_SERVICES",
    SET_VIEW_STATE_LOADED: "SET_VIEW_STATE_LOADED",
    SET_LAYOUT: "SET_LAYOUT",
    COMPILE_ADDITIONAL_VIEWS: "COMPILE_ADDITIONAL_VIEWS",
    CHECK_DISCLAIMER: "CHECK_DISCLAIMER",
    SHOW_ESMA_POPUP: "SHOW_ESMA_POPUP",
    SHOW_DISCLAIMER_POPUP: "SHOW_DISCLAIMER_POPUP",
    SHOW_WL_DISCLAIMER_POPUP: "SHOW_WL_DISCLAIMER_POPUP",
    SHOW_CHANGE_PASSWORD_POPUP: "SHOW_CHANGE_PASSWORD_POPUP",
    SHOW_WHATS_NEW_POPUP: "SHOW_WHATS_NEW_POPUP",
    CHECK_ACCOUNT_STATUS: "CHECK_ACCOUNT_STATUS",
    CHECK_ACCOUNT_EXPIRED_LOGIN_AVAILABLE: "CHECK_ACCOUNT_EXPIRED_LOGIN_AVAILABLE",
    ADD_MODULES: "ADD_MODULES"
};
Object.freeze(StartupStep);

var SymbolSessionType = {
    OPEN: 1,
    PRE_OPEN: 2,
    CLOSED: 3
};
Object.freeze(SymbolSessionType);

var ChartEvent = {
    OPEN_CHART: "ChartEvent.OPEN_CHART",
    ITEM_START_DRAG: "ChartEvent.ITEM_START_DRAG",
    ITEM_END_DRAG: "ChartEvent.ITEM_END_DRAG",
    ITEM_DRAG_DROP: "ChartEvent.ITEM_DRAG_DROP"
}
Object.freeze(ChartEvent);

var DepthEvent = {
    OPEN_DEPTH: "DepthEvent.OPEN_DEPTH",
    ITEM_START_DRAG: "DepthEvent.ITEM_START_DRAG",
    ITEM_END_DRAG: "DepthEvent.ITEM_END_DRAG",
    ITEM_DRAG_DROP: "DepthEvent.ITEM_DRAG_DROP"
}
Object.freeze(DepthEvent);


var SettingsTypeUser = {
    ESMA_DISCLAIMER_ACCEPTED: "startup.esmaPopup",
    LANGUAGE: "language",
    CONFIRM_TRADE: "{env}.confirmTrade",
    CONFIRM_CLOSE_TRADE: "{env}.confirmCloseTrade",
    CONFIRM_MODIFY_TRADE: "{env}.confirmModifyTrade",
    SOUND: "sound",
    SHOW_PROFIT_ON_TAB: "showProfitOnTab",
    DAILY_CHANGE_MODE: "dailyChangeMode",
    CHANGE_PERIOD: "changePeriod",
    MARKET_WATCH_CATEGORY: "marketWatchCategory",
    MARKET_WATCH_PORFOLIOS: "marketWatchPorfolio",
    TRADE_VOLUME: "tradeVolume",
    SKIN: "skin",
    CHART_INDICATORS: "chart.indicators",
    CHART_ANALYST_TOOLS: "chart.analystTools",
    CHART_CURRENT_WORKSPACE: "chart.currentWorkspace",
    CHART_TOOLBAR: "chart.toolbar",
    CHART_MARKET_SESSIONS: "chart.marketSession",
    WHATS_NEW_VERSION: "whatsNewVersion"
};
Object.freeze(SettingsTypeUser);

var SettingsTypeCommon = {
    LANGUAGE: "language",
    LAST_LOGIN_USERNAME: "lastLoginUsername",
    LAST_LOGIN_DATA: "lastAccount",
    DETACH: "detach"
};
Object.freeze(SettingsTypeCommon);


var PopupsType = {
    ANALYST_TOOLS_LIST_PANEL: "analyst-tools-list-panel",
    CHART_CONFIG_PANEL: "chart-config-panel",
    CHART_CUSTOMIZE_TOOLBAR_PANEL: "chart-customize-toolbar-panel",
    POPUP_BASKET_TRADING: "popup-basket-trading",
    POPUP_BUG_REPORT: "popup-bug-report",
    POPUP_CASH_OPERATIONS_REPORT: "popup-cash-operations-report",
    POPUP_IB_LEDGER_HISTORY_REPORT: "popup-ib-ledger-history-report",
    POPUP_CHANGE_PASSWORD: "popup-change-password",
    POPUP_CLIENT_OFFICE: "popup-client-office",
    POPUP_FEEDBACK_FORM: "popup-feedback-form",
    POPUP_FILTER_DATAGRID_COLUMN: "popup-filter-datagrid-column",
    POPUP_GO_TO_PENDING_STC: "popup-go-to-pending-stc",
    POPUP_HISTORY_REPORT: "popup-history-report",
    POPUP_MODIFY_TRADE_PRICE: "popup-modify-trade-price",
    POPUP_MODIFY_TRADE_EXPIRATION: "popup-modify-trade-expiration",
    POPUP_PERSONALIZE_DATAGRID: "popup-personalize-datagrid",
    POPUP_REGISTER_ACCOUNT: "popup-register-account",
    POPUP_SHARE_CHART: "popup-share-chart",
    POPUP_STC_SLTP_NOTICE: "popup-stc-sltp-notice",
    POPUP_STOCKS_SUMMARY: "popup-stocks-summary",
    POPUP_TOASTS_HISTORY: "popup-toasts-history",
    POPUP_SYMBOL_INFO: "popup-symbol-info",
    POPUP_OPEN_TRADES_SYMBOL_INFO: "popup-open-trades-symbol-info",
    POPUP_OPEN_TRADES_POSITION_INFO: "popup-open-trades-position-info",
    POPUP_CLOSED_POSITION_DETAILS: "closed-position-details-popup",
    POPUP_EXECUTION_LIST: "popup-execution-list",
    POPUP_TRADE_TICKET_MODIFY: "popup-trade-ticket-modify",
    POPUP_TRADE_TICKET: "popup-trade-ticket",
    POPUP_UPGRADE_TO_REAL: "popup-upgrade-to-real",
    POPUP_WHATS_NEW: "popup-whats-new",
    POPUP_NEWS_FULL_SCREEN_IMAGE: "popup-news-full-screen-image",
    POPUP_CONFIRM_BASKET: "popup-confirm-basket",
    POPUP_CONFIRM_CLOSE_ALL: "popup-confirm-close-all",
    POPUP_CONFIRM_REMOVESLTP: "popup-confirm-removesltp",
    POPUP_CONFIRM_REVERSE_TRADE: "popup-confirm-reverse-trade",
    POPUP_CONFIRM_TICKET_TRADE: "popup-confirm-ticket-trade",
    POPUP_CONFIRM_TRADE: "popup-confirm-trade",
    POPUP_HISTORY_LIMIT: "popup-history-limit",
    POPUP_CASH_OPERATIONS_LIMIT: "popup-cash-operations-history-limit",
    POPUP_ACCOUNT_STATUS: "popup-account-status",
    POPUP_DEPOSIT_FUNDS: "popup-deposit-funds",
    POPUP_DISCLAIMER: "popup-disclaimer",
    POPUP_MIFIR_DISCLAIMER: "popup-mifir-disclaimer",
    POPUP_SPAIN_DISCLAIMER: "popup-spain-disclaimer",
    POPUP_EXPIRED_LOGIN_AVAILABLE: "popup-expired-login-available",
    POPUP_LIMITED_RISK_ACCOUNT: "popup-limited-risk-account",
    POPUP_PASSWORD_CHANGED: "popup-password-changed",
    POPUP_PENDING_STOP: "popup-pending-stop",
    POPUP_STATEMENT: "popup-statement",
    POPUP_STOP_OUT: "popup-stop-out",
    POPUP_SWITCH_ACCOUNT: "popup-switch-account",
    POPUP_ESMA: "popup-esma",
    POPUP_SESSION_STATUS: "popup-session-status"
};
Object.freeze(PopupsType);

var FilterType = {
    LIST: "list",
    TEXT: "text",
    NUMBER: "number",
    LIST_OR: "list_or"
};
Object.freeze(FilterType);


var PopupEvent = {
    ADD: 1,
    REMOVE: 2,
    CHANGE_ORDER: 3
};
Object.freeze(PopupEvent);

var MainEvents = {
    APP_INITIALIZED: "MainEvents.appInitialized",
    SYMBOLS_INITIALIZED: "MainEvents.symbolsInitialized",
    TRADES_INITIALIZED: "MainEvents.tradesInitialized",
    REBUILD_LAYOUT: "MainEvents.rebuildLayout",
    ESC_POPUP: "MainEvents.closePopup",
    ENTER_POPUP: "MainEvents.acceptPopup",
    DEL_POPUP: "MainEvents.del",
    RUNTIME_ERROR: "MainEvents.runtimeError",
    ALERT_PRICE_POPUP: "MainEvents.alertPricePopup",
    ACCOUNT_STATUS_CATCH: "MainEvents.ACCOUNT_STATUS_CATCH",
    CONNECTION_STATUS_DATA_UPDATE: "MainEvents.CONNECTION_STATUS_DATA_UPDATE"
};
Object.freeze(MainEvents);

var AppModes = {
    WIDGET: 0,
    BASIC: 1,
    NORMAL: 2,
    CONTEST: "contest"
};
Object.freeze(AppModes);

var XsWidgetType = {
    CHARTS: ModulesType.CHARTS,
    MARKET_WATCH: ModulesType.MARKET_WATCH,
    CLICK_AND_TRADE: "clickAndTrade",
    MARKET_SENTIMENTS: ModulesType.MARKET_SENTYMENTS,
    TOP_MOVERS: ModulesType.TOP_MOVERS,
    HEATMAP_FOREX: ModulesType.HEATMAP_FOREX,
    HEATMAP_EQUITIES: ModulesType.HEATMAP_EQUITIES,
    NEWS: ModulesType.NEWS,
    CALENDAR: ModulesType.CALENDAR
};
Object.freeze(XsWidgetType);

var AppStates = {
    UNINITIALIZED: "uninitialized",
    SUPPORT_MOBILE: "supportMobile",
    SUPPORT_BROWSER: "supportBrowser",
    LOGIN: "login",
    LOGGED_IN: "loggedIn",
    LOGGED_OUT: "loggedOut"
};
Object.freeze(AppStates);


var Environment = {
    REAL: "real",
    DEMO: "demo",
    WIDGET: "widget",
    WIDGET_CONTEST: "widget_contest"
};
Object.freeze(Environment);

var SocketStatus = {
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    DISCONNECTING: "DISCONNECTING",
    CLOSED: "CLOSED",
    ERROR: "ERROR"
};
Object.freeze(SocketStatus);

var SettingsDefaultUserData = {
    sound: {
        volume: 40,
        all: !0,
        transactions: !0,
        tradersTalk: !1,
        news: !0,
        calendar: !0,
        priceAlarms: !0,
        otherNotifications: !0,
        connection: !0,
        buttonClick: !0
    },
    showProfitOnTab: !1,
    whatsNewVersion: 0,
    dailyChangeMode: 1,
    changePeriod: 0,
    tradeVolume: {},
    marketWatchCategory: SymbolCategories.FAVORITES,
    demo: {
        confirmTrade: !1,
        confirmCloseTrade: !1,
        confirmModifyTrade: !1
    },
    skin: SkinType.BLACK,
    real: {
        confirmTrade: !0,
        confirmCloseTrade: !0,
        confirmModifyTrade: !0
    },
    chart: {
        indicators: {},
        analystTools: {},
        marketSessions: [],
        currentWorkspace: null,
        toolbar: null
    }
};

var SettingsTypeAccount = {
    DISCLAIMER_ACCEPTED: "startup.disclaimerAccepted",
    WL_DISCLAIMER_ACCPETED: "startup.wlDisclaimerAccepted",
    SHOW_CHANGE_PASSWORD: "startup.showChangePassword",
    NOTIFICATIONS_HISTORY_FILTER: "notificationsHistoryFilter",
    NOTIFICATIONS_FILTER: "notificationsFilter",
    PRICE_ALERTS: "priceAlerts",
    LAYOUT: "layout",
    LAYOUT_CONTAINERS: "layoutContainers",
    LAYOUT_MODULES_DETACHED: "layoutModulesDetached",
    SHOWED_PENDING_STOP_WARNING: "showedPendingStopWarning",
    SHOWED_SL_WARNING: "showedSLWarning",
    SYMBOLS_SLTP: "symbolsSlTp",
    SHORTCUTS: "shortcuts"
};
Object.freeze(SettingsTypeAccount);

var ApplicationLanguage = {
    EN: "en",
    ES: "es",
    AR: "ar"
};
Object.freeze(ApplicationLanguage);


var ModuleConstraints = {};


ModuleConstraints[ModulesType.DEPTH] = {
    minWidth: 250,
    minHeight: 260
};
ModuleConstraints[ModulesType.MARKET_WATCH_DEPTH] = {
    minWidth: 500,
    minHeight: 260
};

ModuleConstraints[ModulesType.MARKET_WATCH] = {
    minWidth: 250,
    minHeight: 260
};
ModuleConstraints[ModulesType.OPEN_TRADES] = {
    minHeight: 90
};
ModuleConstraints[ModulesType.PENDING_TRADES] = {
    minHeight: 90
};
ModuleConstraints[ModulesType.CASH_OPERATIONS] = {
    minHeight: 90
};
ModuleConstraints[ModulesType.ORDERS_HISTORY] = {
    minHeight: 90
};
ModuleConstraints[ModulesType.CALENDAR] = {
    minHeight: 133,
    minWidth: 600
};
ModuleConstraints[ModulesType.MARKET_ANALYSIS] = {
    minHeight: 365,
    minWidth: 970
};
ModuleConstraints[ModulesType.CHARTS] = {
    minWidth: 681,
    minHeight: 300
};
ModuleConstraints[ModulesType.NEWS] = {
    minWidth: 681,
    minHeight: 113
};
ModuleConstraints[ModulesType.STATISTICS] = {
    minHeight: 110
};
ModuleConstraints[ModulesType.EDUCATION] = {
    minWidth: 700,
    minHeight: 200
};
ModuleConstraints[ModulesType.HISTORY] = {
    minWidth: 700,
    minHeight: 200
};
Object.freeze(ModuleConstraints);

var ModulesConfig = {};
ModulesConfig[ModulesType.SUPPORT_BROWSER] = {
    gaId: "Support_Browser"
};
ModulesConfig[ModulesType.SUPPORT_MOBILE] = {
    gaId: "Support_Mobile"
};
ModulesConfig[ModulesType.LOGIN] = {
    gaId: "Login"
};
ModulesConfig[ModulesType.MY_ACCOUNT] = {
    gaId: "My_Account",
    children: [ModulesType.SUMMARY, ModulesType.STATISTICS]
};
ModulesConfig[ModulesType.SUMMARY] = {
    gaId: "Summary"
};
ModulesConfig[ModulesType.STATISTICS] = {
    gaId: "Statistics"
};
ModulesConfig[ModulesType.SETTINGS] = {
    gaId: "Settings"
};
ModulesConfig[ModulesType.MARKET_WATCH] = {
    gaId: "Market_Watch"
};
ModulesConfig[ModulesType.MARKET_WATCH_DEPTH] = {
    gaId: "Market_Watch_depth"
};
ModulesConfig[ModulesType.MARKET_ANALYSIS] = {
    gaId: "Market_Analysis",
    children: [ModulesType.MARKET_SENTYMENTS, ModulesType.TOP_MOVERS, ModulesType.SCREENER, ModulesType.HEATMAP, ModulesType.FUND_SELECTOR]
};
ModulesConfig[ModulesType.MARKET_SENTYMENTS] = {
    gaId: "Market_Sentiment"
};
ModulesConfig[ModulesType.HEATMAP] = {
    gaId: "Heatmap"
};
ModulesConfig[ModulesType.HEATMAP_FOREX] = {
    gaId: "Heatmap_Forex",
    isSubModule: !0
};
ModulesConfig[ModulesType.HEATMAP_EQUITIES] = {
    gaId: "Heatmap_Equities",
    isSubModule: !0
};
ModulesConfig[ModulesType.TOP_MOVERS] = {
    gaId: "Top_Movers"
};
ModulesConfig[ModulesType.SCREENER] = {
    gaId: "Stocks_Scanner"
};
ModulesConfig[ModulesType.FUND_SELECTOR] = {
    gaId: "ETF_Scanner"
};
ModulesConfig[ModulesType.CHARTS] = {
    gaId: "Charts",
    isDetachable: !0
};
ModulesConfig[ModulesType.NEWS] = {
    gaId: "News"
};
ModulesConfig[ModulesType.OPEN_TRADES] = {
    gaId: "Open_Positions"
};
ModulesConfig[ModulesType.PENDING_TRADES] = {
    gaId: "Pending_Orders"
};
ModulesConfig[ModulesType.EDUCATION] = {
    gaId: "Education"
};
ModulesConfig[ModulesType.BASKETS] = {
    gaId: "Baskets"
};
ModulesConfig[ModulesType.HISTORY] = {
    gaId: "history"//,
    //children: [ModulesType.CLOSED_POSITIONS, ModulesType.ORDERS_HISTORY]
};
ModulesConfig[ModulesType.CLOSED_POSITIONS] = {
    gaId: "Closed_Positions"
};
ModulesConfig[ModulesType.CASH_OPERATIONS] = {
    gaId: "Cash_Operations"
};
ModulesConfig[ModulesType.IB_LEDGER_HISTORY] = {
    gaId: "IB_Ledger"
};
ModulesConfig[ModulesType.ORDERS_HISTORY] = {
    gaId: "Orders"
};
ModulesConfig[ModulesType.CALENDAR] = {
    gaId: "Calendar",
    children: [ModulesType.CALENDAR_ECONOMIC, ModulesType.CALENDAR_DIVIDEND]
};
ModulesConfig[ModulesType.CALENDAR_ECONOMIC] = {
    gaId: "Calendar_Economic"
};
ModulesConfig[ModulesType.CALENDAR_DIVIDEND] = {
    gaId: "Calendar_Dividend"
};
ModulesConfig[ModulesType.DEPTH] = {
    gaId: "depth"
};

Object.freeze(ModulesConfig);


var PredefinedLayouts = {};
PredefinedLayouts.overlaySettings = {
    layout: {
        layoutType: "overlaySettings",
        type: ContainerDataType.TABS,
        percentSize: 100,
        containerId: "overlaySettings"
    },
    containers: {
        overlaySettings: [{
            id: ModulesType.SETTINGS
        }]
    }
};
PredefinedLayouts.overlayMyAccount = {
    layout: {
        layoutType: "overlayMyAccount",
        type: ContainerDataType.TABS,
        percentSize: 100,
        containerId: "overlayMyAccount"
    },
    containers: {
        overlayMyAccount: [{
            id: ModulesType.MY_ACCOUNT,
            activeChildIndex: 0
        }]
    }
};
PredefinedLayouts.specifiedModule = {
    layout: {
        layoutType: "specifiedModule",
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.TABS,
            percentSize: 100,
            containerId: "specifiedModule"
        }]
    },
    containers: {
        specifiedModule: [{
            id: ModulesType.CHARTS
        }]
    }
};

PredefinedLayouts[EndpointType.MAE] = {
    layoutDefault: {
        layoutType: "Default",
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.HORIZONTAL,
            percentSize: 75,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 30,
                containerId: 1
            }, {
                type: ContainerDataType.TABS,
                percentSize: 70,
                containerId: 2
            }]
        }, {
            type: ContainerDataType.HORIZONTAL,
            percentSize: 25,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 100,
                containerId: 3
            }]
        }]
    },
    layoutBasic: {
        layoutType: "Basic",
        copy: [1, 1],
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.HORIZONTAL,
            percentSize: 75,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 30,
                containerId: 1
            }, {
                type: ContainerDataType.TABS,
                percentSize: 70,
                containerId: 2
            }]
        }, {
            type: ContainerDataType.HORIZONTAL,
            percentSize: 25,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 50,
                containerId: 3
            }]
        }]
    },
    layoutMWCharts: {
        layoutType: "MWCharts",
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.HORIZONTAL,
            percentSize: 100,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 30,
                containerId: 1
            }, {
                type: ContainerDataType.TABS,
                percentSize: 70,
                containerId: 2
            }]
        }]
    },
    layoutChartPositions: {
        layoutType: "ChartPositions",
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.HORIZONTAL,
            percentSize: 75,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 100,
                containerId: 2
            }]
        }, {
            type: ContainerDataType.HORIZONTAL,
            percentSize: 25,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 100,
                containerId: 3
            }]
        }]
    },
    layoutChart: {
        layoutType: "Chart",
        type: ContainerDataType.VERTICAL,
        percentSize: 100,
        children: [{
            type: ContainerDataType.HORIZONTAL,
            percentSize: 100,
            children: [{
                type: ContainerDataType.TABS,
                percentSize: 100,
                containerId: 2
            }]
        }]
    },
    basicSizes: {
        normal: {
            vertical: [33, 66],
            horizontal: [66, 33]
        },
        large: {
            vertical: [25, 75],
            horizontal: [75, 25]
        },
        largeM: {
            vertical: [20, 80],
            horizontal: [80, 20]
        },
        largeL: {
            vertical: [17, 83],
            horizontal: [83, 17]
        },
        larger: {
            vertical: [14, 86],
            horizontal: [86, 14]
        }
    },
    containers: {
        1: [
            {
                id: ModulesType.MARKET_WATCH
            },
            {
                id: ModulesType.MARKET_WATCH_DEPTH
            }

        ],
        2: [
            {
                id: ModulesType.HISTORY
            },
            {
                id: ModulesType.DEPTH
            },
            {
                id: ModulesType.CHARTS
            },
            {
                id: ModulesType.GARANTY
            }

            // , {
            //     id: ModulesType.NEWS
            // }, {
            //     id: ModulesType.CALENDAR,
            //     activeChildIndex: 0
            // }, {
            //     id: ModulesType.MARKET_ANALYSIS,
            //     activeChildIndex: 0
            // }, {
            //     id: ModulesType.EDUCATION
            // }, 
            // {
            //     id: ModulesType.SYMBOL_INFO,
            //     activeChildIndex: 0
            // }
        ],
        3: [{
            id: ModulesType.OPEN_TRADES
        }, {
            id: ModulesType.PENDING_TRADES
        },

        {
            id: ModulesType.REJECTED
        }]
    }
};



var SettingsDefaultAccountData = {
    MAE: {
        // startup: {
        //     wlDisclaimerAccepted: !1
        // },
        // notificationsHistoryFilter: {
        //     trading: !0,
        //     tradersTalk: !0,
        //     news: !0,
        //     calendar: !0,
        //     marketSentiment: !0,
        //     tradersList: !0,
        //     priceAlerts: !0,
        //     marginCall: !0,
        //     warning: !0
        // },
        // notificationsFilter: {
        //     trading: !0,
        //     tradersTalk: !1,
        //     news: !0,
        //     calendar: !0,
        //     marketSentiment: !1,
        //     tradersList: !1,
        //     priceAlerts: !0,
        //     marginCall: !1,
        //     warning: !0
        // },
        // priceAlerts: [],
        // news: {
        //     rangeFrom: 2592e5,
        //     source: {
        //         tradebeat: !0,
        //         talk: !1,
        //         rss: !1,
        //         rss_wl: !0
        //     },
        //     sound: {
        //         play: !1,
        //         volume: .75
        //     },
        //     open: {
        //         open: !1
        //     }
        // },
        // calendarEconomic: {
        //     datagridSortsData: {
        //         id: "time",
        //         field: "time",
        //         sortAsc: !0
        //     },
        //     datagridColumns: [{
        //         id: "time"
        //     }, {
        //         id: "country"
        //     }, {
        //         id: "title"
        //     }, {
        //         id: "impact"
        //     }, {
        //         id: "currency"
        //     }, {
        //         id: "forecast"
        //     }, {
        //         id: "current"
        //     }, {
        //         id: "previous"
        //     }]
        // },
        // calendarDividend: {
        //     datagridSortsData: {
        //         id: "exDate",
        //         field: "exDate",
        //         sortAsc: !0
        //     },
        //     datagridColumns: [{
        //         id: "country"
        //     }, {
        //         id: "description"
        //     }, {
        //         id: "symbol"
        //     }, {
        //         id: "value"
        //     }, {
        //         id: "exDate"
        //     }, {
        //         id: "payDate"
        //     }]
        // },
        // favoriteSymbols: {
        //     datagridColumns: [{
        //         id: "symbol"
        //     }, {
        //         id: "dailyChange"
        //     }, {
        //         id: "bid"
        //     }, {
        //         id: "ask"
        //     }]
        // },
        marketWatch: {
            datagridColumns: [{
                id: "symbol"
            }, {
                id: "dailyChange"
            }, {
                id: "bid"
            }, {
                id: "ask"
            }]
        },
        charts: {
            currentWorkspace: "",
            defaultSymbols: ["EURUSD_1", "OIL_2", "GOLD_2", "DE30_3"],
            defaultSymbols2: ["EURUSD_1", "GOLD_2"],
            toolbar: null,
            placePendingReverse: !1
        },
        // marketAnalysis: {},
        // screener: {
        //     datagridColumns: [{
        //         id: "instrument"
        //     }, {
        //         id: "industry"
        //     }, {
        //         id: "country"
        //     }, {
        //         id: "marketCap"
        //     }, {
        //         id: "eps"
        //     }, {
        //         id: "pe"
        //     }, {
        //         id: "dividendYield"
        //     }, {
        //         id: "pbv"
        //     }, {
        //         id: "percChange1Y"
        //     }]
        // },
        // fundSelector: {
        //     datagridColumns: [{
        //         id: "name"
        //     }, {
        //         id: "categoryName"
        //     }, {
        //         id: "arfTotalExpenseRatio"
        //     }, {
        //         id: "ttrReturn1Yr"
        //     }, {
        //         id: "ttrReturn3Yr"
        //     }, {
        //         id: "ttrReturn5Yr"
        //     }, {
        //         id: "returnSinceInception"
        //     }, {
        //         id: "ratingOverall"
        //     }, {
        //         id: "riskOverall"
        //     }]
        // },
        // topMovers: {
        //     selectedPeriod: "move_d1",
        //     filters: [1, 2, 3]
        // },
        // heatmapEquities: {
        //     selectedHeatmap: "4_US",
        //     selectedPeriod: "move_d1"
        // },
        // heatmapForex: {
        //     selectedHeatmap: "1",
        //     selectedPeriod: "move_d1"
        // },
        // marketSentiments: {
        //     viewType: "list",
        //     sentimentsType: 1,
        //     selection: [-1],
        //     symbols: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "US500", "DE30", "UK100", "SPA35", "GOLD", "SILVER", "OIL", "COFFEE", "USDCAD", "NZDUSD", "EURJPY", "EURGBP", "USDCHF", "USDTRY", "EURTRY", "USDPLN", "EURPLN", "USDCLP", "USDCZK", "USDRON", "US30", "US100", "FRA40", "EU50", "W20", "OIL.WTI", "NATGAS", "SUGAR"]
        // },
        openTrades: {
            datagridColumns: [{
                id: "sequenceNumber"
            }, {
                id: "position"
            },
            {
                id: "tradeType"
            },
            {
                id: "price"
            },
            {
                id: "volume"
            },
            {
                id: "total"
            },
            {
                id: "marketValue"
            },
            {
                id: "date"
            },
            {
                id: "sl"
            }, {
                id: "tp"
            }, {
                id: "openPrice"
            }, {
                id: "marketPrice"
            }, {
                id: "profit"
            }, {
                id: "totalProfit"
            }, {
                id: "netProfitPercent"
            }, {
                id: "close"
            }]
        },
        pendingTrades: {
            datagridColumns: [{
                id: "activa"
            },{
                id: "order"
            },
            {
                id: "symbo_name"
            },
            {
                id: "type"
            },
            {
                id: "price"
            }, {
                id: "volume"
            }, {
                id: "sl"
            }, {
                id: "tp"
            }, {
                id: "marketPrice"
            },
            {
                id: "total"
            }, {
                id: "expiration"
            },
            {
                id: "update"
            },
            {
                id: "delete"
            },]
        },
        rejected: {
            datagridColumns: [{
                id: "order"
            },
            {
                id: "symbo_name"
            },
            {
                id: "type"
            },
            {
                id: "price"
            }, {
                id: "volume"
            }, {
                id: "openPrice"
            }, {
                id: "sl"
            }, {
                id: "tp"
            },
            {
                id: "comment"
            }
            ]
        },
        garanty: {
            datagridColumns: [{
                id: "receptor"
            },
            {
                id: "dador"
            },
            {
                id: "moneda"
            },
            {
                id: "montoAsignado"
            },
            {
                id: "montoConsumido"
            },
            {
                id: "fichas"
            },
            {
                id: "disponible"
            },
            {
                id: "clearingHouse"
            }
            ]
        },
        // closedPositions: {
        //     datagridSortsData: {
        //         id: "closeTime",
        //         field: "closeTime",
        //         sortAsc: !1
        //     },
        //     datagridColumns: [{
        //         id: "symbol"
        //     }, {
        //         id: "position"
        //     }, {
        //         id: "type"
        //     }, {
        //         id: "lots"
        //     }, {
        //         id: "openTime"
        //     }, {
        //         id: "openPrice"
        //     }, {
        //         id: "closeTime"
        //     }, {
        //         id: "closePrice"
        //     }, {
        //         id: "profit"
        //     }, {
        //         id: "totalProfit"
        //     }, {
        //         id: "comment"
        //     }, {
        //         id: "positionInfo"
        //     }]
        // },
        // cashOperations: {
        //     datagridColumns: [{
        //         id: "id"
        //     }, {
        //         id: "ledgerType"
        //     }, {
        //         id: "timestamp"
        //     }, {
        //         id: "symbol"
        //     }, {
        //         id: "comment"
        //     }, {
        //         id: "nominal"
        //     }]
        // },
        history: {
            datagridColumns: [{
                id: "IdOrden"
            },
            {
                id: "NumeroOrdenInterno"
            },
            {
                id: "IdEstado"
            },
            {
                id: "NumeroOrdenInterno"
            },
            {
                id: "FechaConcertacion"
            },
            {
                id: "CompraVenta"
            },
            {
                id: "ProductoDescripcion"
            },
            {
                id: "PlazoDescripcion"
            },
            {
                id: "MonedaDescripcion"
            },
            {
                id: "CodigoMercado"
            },
            {
                id: "Precio"
            },
            {
                id: "Cantidad"
            },
            {
                id: "Ejecutada"
            },
            {
                id: "Remanente"
            },
            {
                id: "PersonaDescripcion"
            },
            {
                id: "NumeroOrdenMercado"
            },
            {
                id: "NroOperacionMercado"
            },
            {
                id: "PrecioDetalle"
            },
            {
                id: "Cantidad"
            },
            {
                id: "Monto"
            }
            ],
        },
        // statisticsModule: {
        //     symbols: []
        // },
        layout: PredefinedLayouts.MAE.layoutDefault,
        layoutContainers: PredefinedLayouts.MAE.containers,
        layoutBasic: PredefinedLayouts.MAE.layoutBasic,
        layoutBasicSizes: PredefinedLayouts.MAE.basicSizes,
        shortcutSettings: {
            "alt+ctrl+c": !1,
            "alt+ctrl+x": !1,
            "alt+ctrl+z": !1,
            "alt+ctrl+b": !1,
            "alt+ctrl+s": !1
        },
        topMoversFilers: [SymbolCategories.FOREX, SymbolCategories.CRYPTO, SymbolCategories.COMMODITIES, SymbolCategories.INDICES]
    }
};

var ContainerDataType = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    TABS: "tabs",
    MODULES: "modules"
};
Object.freeze(ContainerDataType);

var AssetClass = {
    1: {
        name: "PF1"
    },
    2: {
        name: "PF2"
    },
    3: {
        name: "PF3"
    },
    PF1: 1,
    PF2: 2,
    PF3: 3
};
Object.freeze(AssetClass);


var MaeMessageType = {
    OPEN_TRADE: "open_trade",
    OPEN_TRADE_LIST: "open_trade_list",
    PENDING_TRADE_LIST: "pending_trade_list",
    REJECTED_LIST: "rejected_list",
    HISTORY_LIST: "history_list",
    BITACORA: "bitacora_list",
    DETALLE: "detalle_list",
    GARANTY: "garanty_list",

};
Object.freeze(MaeMessageType);

var TradeSide = {
    BUY: 0,
    SELL: 1
};
Object.freeze(TradeSide);
var RecordType = {
    OPEN: 0,
    PENDING: 1,
    CLOSE: 2,
    MODIFY: 3,
    DELETE: 4,
    CLOSE_ALL: 5,
    MODIFY_GROUP: 6,
    OPEN_BASKET: 7
};
Object.freeze(RecordType);

var SocketMessageType = {
    PRICE: 1,
    OPEN_TRADE: 2,
    PENDING_TRADE: 3

};


Object.freeze(SocketMessageType);

var subMaeApiType = {
    NEW: 0,
    UPDATED: 1,
    REMOVED: 2,
    ITEM_LIST: 6
};

Object.freeze(subMaeApiType);


var OrderType = {
    BID: 1,
    ASK: 2
};
Object.freeze(OrderType);

var WorkerMessageType = {
    PRODUCTS: 1,
    QUOTE: 5,
    ORDERS: 6
};
Object.freeze(WorkerMessageType);

var PlazoType = {
    CI: "CI",
    24: "24hr",
    48: "48hr",
    72: "72Hr"
};
Object.freeze(PlazoType);

var TiposOrden = {
    Day: 0,
    IOC: 3,
    GTD: 6,
    GTC: 1
};
Object.freeze(TiposOrden);

var TradeShowType = {
    NEW: 1,
    UPDATE: 2
}
Object.freeze(TradeShowType);


var DateTimeFormat = {
    MOMENT: {
        SHORT_DATE_SLASH: "DD/MM/YY"
    }

};
Object.freeze(DateTimeFormat);

var OrderStatus = {
    INGRESADA: 1,
    CONFIRMADA: 4,
    ENMERCADO: 8
};
Object.freeze(OrderStatus);