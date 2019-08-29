(function ($) {
  function SlickGridPager(dataView, grid, $container, options) {
    var $status;
    var _options;
    this._pagingInfo = {
      pageSize: 0,
      pageNum: 0,
      totalPages: 0,
      totalRows : 0
    };


    if (options) {
      if (options.pageSize)
        this._pagingInfo.pageSize = options.pageSize;

      if (options.pageNum)
        this._pagingInfo.pageNum = options.pageNum;

      if (options.totalPages)
        this._pagingInfo.totalPages = options.totalPages;
    }



    var self = this;

    this.signalPageChange = new signals.Signal;

    var _defaults = {
      showAllText: "Showing all {rowCount} rows",
      showPageText: "Showing page {pageNum} of {pageCount}... {rowCount} rows"
    };


    function init() {
      _options = $.extend(true, {}, _defaults, options);

      //dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
      //  updatePager(pagingInfo);
      //});

      constructPagerUI();
      updatePager(getPagingInfo());
    }

    function getNavState() {
      var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
      var pagingInfo = getPagingInfo();
      var lastPage = pagingInfo.totalPages - 1;

      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
        pagingInfo: pagingInfo
      }
    }
    function getPagingInfo() {
      //return dataView.getPagingInfo();
      return self._pagingInfo;

    }

    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      setPagingOptions({ pageSize: n, pageNum:0 });
      //dataView.setPagingOptions({pageSize: n});
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        //dataView.setPagingOptions({pageNum: 0});
        setPagingOptions({ pageNum: 0 });
      }
    }

    function gotoLast() {
      var state = getNavState();
      if (state.canGotoLast) {
        // dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
        setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
      }
    }

    function gotoPrev() {
      var state = getNavState();
      if (state.canGotoPrev) {
        //dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
        setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
      }
    }

    function gotoNext() {
      var state = getNavState();
      if (state.canGotoNext) {
        // dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
        setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
      }
    }

    function setPagingOptions(data, fire) {
      //dataView.setPagingOptions(data);

      self._pagingInfo = $.extend(true, {}, self._pagingInfo, data);
      updatePager(getPagingInfo());

      if (fire === undefined)
        self.signalPageChange.dispatch(getPagingInfo());
    }

    function constructPagerUI() {
      $container.empty();

      var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
      var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
      $status = $("<span class='slick-pager-status' style='font-size:11px;font-weight:500'/>").appendTo($container);

      //$settings.append("<span class='slick-pager-settings-expanded' >Show: <a data=0>All</a><a data='-1'>Auto</a><a data=25>25</a><a data=50>50</a><a data=100>100</a><a data=2>2</a></span>");
      //style='display:none'
      $settings.append("<span class='slick-pager-settings-expanded' style='font-weight:500;font-size:11px'>Show: <a data=25>25</a><a data=50>50</a><a data=100>100</a><a data=2>2</a></span>");

      $settings.find("a[data]").click(function (e) {
        var pagesize = $(e.target).attr("data");
        if (pagesize != undefined) {
          if (pagesize == -1) {
            var vp = grid.getViewport();
            setPageSize(vp.bottom - vp.top);
          } else {
            setPageSize(parseInt(pagesize));
          }
        }
      });

      var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
      var icon_suffix = "' /></span>";

      $(icon_prefix + "ui-icon-lightbulb" + icon_suffix)
        .click(function () {
          //$(".slick-pager-settings-expanded").toggle()
          $(".slick-pager-settings-expanded").toggleClass("slick-pager-settings-expanded-animate");

        })
        .appendTo($settings);

      $(icon_prefix + "ui-icon-seek-first" + icon_suffix)
        .click(gotoFirst)
        .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-prev" + icon_suffix)
        .click(gotoPrev)
        .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-next" + icon_suffix)
        .click(gotoNext)
        .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-end" + icon_suffix)
        .click(gotoLast)
        .appendTo($nav);

      $container.find(".ui-icon-container")
        .hover(function () {
          $(this).toggleClass("ui-state-hover");
        });

      $container.children().wrapAll("<div class='slick-pager' />");
    }


    function updatePager(pagingInfo) {
      var state = getNavState();



      $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
      if (!state.canGotoFirst) {
        $container.find(".ui-icon-seek-first").addClass("ui-state-disabled");
      }
      if (!state.canGotoLast) {
        $container.find(".ui-icon-seek-end").addClass("ui-state-disabled");
      }
      if (!state.canGotoNext) {
        $container.find(".ui-icon-seek-next").addClass("ui-state-disabled");
      }
      if (!state.canGotoPrev) {
        $container.find(".ui-icon-seek-prev").addClass("ui-state-disabled");
      }

      if (pagingInfo.pageSize == 0) {
        $status.text(_options.showAllText.replace('{rowCount}', pagingInfo.totalRows + "").replace('{pageCount}', pagingInfo.totalPages + ""));
      } else {
        $status.text(_options.showPageText.replace('{pageNum}', pagingInfo.pageNum + 1 + "").replace('{pageCount}', pagingInfo.totalPages + "").replace('{rowCount}', pagingInfo.totalRows + ""));
      }
    }


    SlickGridPager.prototype.setData = function (data) {
      setPagingOptions(data, false);
    }

    init();
  }

  SlickGridPager.prototype.subscribe = function (func) {
    this.signalPageChange.add(func);

  };

  SlickGridPager.prototype.unSubscribe = function (func) {
    this.signalPageChange.remove(func);

  };



  // Slick.Controls.Pager
  $.extend(true, window, { Slick: { Controls: { Pager: SlickGridPager } } });
})(jQuery);
