/*
 *  bkDialog v1.0
 *  author锛氳摑椴告櫤浜�
 *  Copyright (c) 2012-2017 Tencent BlueKing. All Rights Reserved.
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.bkDialog = factory());
})(this, (function() {
    'use strict';

    /**
     *  缂栬瘧DOM鑺傜偣瀛楃涓�
     *  @param html {String} 鎷兼帴鐨凞OM瀛楃涓�
     *  @return DOM {DOMNode} DOM鑺傜偣
     */
    var _compile = function(html) {
        var temp = document.createElement('div'),
            children = null,
            fragment = document.createDocumentFragment();

        temp.innerHTML = html;
        children = temp.childNodes;

        for(var i = 0, length = children.length; i < length; i++) {
            fragment.appendChild(children[i].cloneNode(true));
        }

        return fragment;
    }

    /**
     *  鎻掍欢鐨勬瀯閫犲嚱鏁�
     *  @param 鐢ㄦ埛鑷畾涔夌殑鍙傛暟
     */
    function bkDialog(options) {
        var opts = options || {};

        this.type = opts.type || 'default';                  // 寮圭獥鐨勭被鍨�, 鍙€夌殑鍊兼湁success, error, warning, loading, dialog, default
        this.width = opts.width || 400;                     // 寮圭獥鐨勫搴�
        this.title = opts.title || '纭畾鎵ц璇ユ搷浣�?';        // 寮圭獥鐨則itle
        this.content = opts.content === false ? false : (opts.content || '娆㈣繋浣跨敤 bkDialog 缁勪欢锛�');    // 寮圭獥鐨勫唴瀹�
        this.icon = opts.icon || false;                     // success, error, warning, loading鍥涚绫诲瀷鏃讹紝鑷畾涔夌殑鍥炬爣
        this.hasHeader = opts.hasHeader === false ? false : true;     // 鏄惁鏄剧ず澶撮儴
        this.statusOpts = opts.statusOpts || {};            // 浣跨敤鍐呯疆鐘舵€佹椂鐨勮缃紝鍙敤鐨刱ey鏈塼itle锛宻ubTitle
        this.padding = opts.padding || (opts.padding === 0 ? 0 : false);               // 鑷畾涔塪ialog-body鐨刾adding鍊�
        this.closeIcon = opts.closeIcon === false ? false : true;     // 鏄惁鏈夊叧闂浘鏍�
        this.style = opts.style || 'primary';                      // 鎻掍欢鐨勯鑹查鏍�
        this.confirm = opts.confirm || '纭畾';              // 纭畾鎸夐挳鐨勬枃瀛�
        this.cancel = opts.cancel || '鍙栨秷';                // 鍙栨秷鎸夐挳鐨勬枃瀛�
        this.quickClose = opts.quickClose === false ? false : true;          // 鏄惁鍏佽鐐瑰嚮閬僵鍏抽棴dialog
        this.confirmFn = opts.confirmFn || function() {};   // 纭畾鐨勫洖璋冨嚱鏁�
        this.cancelFn = opts.cancelFn || function() {};     // 鍙栨秷鐨勫洖璋冨嚱鏁�
        this.onShow = opts.onShow || function() {};         // 鎵撳紑dialog鏃剁殑鍥炶皟
        this.onClose = opts.onClose || function() {};       // 鍏抽棴dialog鏃剁殑鍥炶皟

        _init.call(this);
    }

    /**
     *  鍒濆鍖栧嚱鏁�
     */
    var _init = function() {
        _initStyle.call(this);
    }

    /**
     *  鍒濆鍖栨牱寮�
     */
    var _initStyle = function() {
        var type = this.type,
            isDefaultType = (type === 'loading' || type === 'error' || type === 'success' || type === 'warning' ? true : false),
            statusOpts = isDefaultType ? this.statusOpts : {},
            _this = this,
            isStyle = this.style.indexOf('#') === 0;
        var html = '',
            defaultDOM = {
                "title": '',
                "subTitle": ''
            },
            body = '',
            icon = '';

        switch(type) {
            case 'loading':
                defaultDOM.title = 'loading';
                defaultDOM.subTitle = '璇风◢绛�...';
                icon = this.icon ? (this.icon.match(/^\<img/) ? this.icon : '<p><i class="bk-icon icon-'+this.icon+' bk-dialog-mark bk-dialog-loading"></i></p>') : '<img src="https://magicbox.bkclouds.cc/static/v3/assets/bkDialog-2.0/images/default_loading.png" alt="loading" class="bk-dialog-mark bk-dialog-loading">';
                break;
            case 'error':
                defaultDOM.title = '娣诲姞鐢ㄦ埛澶辫触';
                defaultDOM.subTitle = '姝ょ獥鍙�<span class="bk-dialog-error-text">3s</span>鍚庡叧闂�';
                icon = this.icon || 'close';
                break;
            case 'success':
                defaultDOM.title = '娣诲姞鐢ㄦ埛鎴愬姛';
                defaultDOM.subTitle = '<a href="javascript:;" class="bk-dialog-primary-text">缁х画娣诲姞 >></a>';
                icon = this.icon || 'check-1';
                break;
            case 'warning':
                defaultDOM.title = '姝ゆ搷浣滃瓨鍦ㄩ闄�';
                icon = this.icon || 'exclamation';
        }

        if(isDefaultType) {
            body += '<div class="bk-dialog-row">'+
                      (type === 'loading' ? icon : '<p><i class="bk-icon icon-'+icon+' bk-dialog-mark bk-dialog-'+type+'"></i></p>')+
                    '</div>'+
                    '<h3 class="bk-dialog-title bk-dialog-row">' + (statusOpts.title || defaultDOM.title) + '</h3>'+
                    (statusOpts.subTitle || defaultDOM.subTitle ? ('<h5 class="bk-dialog-subtitle bk-dialog-row">' + (statusOpts.subTitle || defaultDOM.subTitle) + '</h5>') : '');
        }
        else {
            body += this.content === false ? '' : this.content;
        }

        html = '<div class="bk-dialog hidden" id="bkDialog">'+
                  '<div class="bk-dialog-wrapper">'+
                    '<div class="bk-dialog-position">'+
                      '<div class="bk-dialog-style" style="width: '+this.width+'px;">'+
                        '<div class="bk-dialog-tool">'+
                          (this.closeIcon ? ('<i class="bk-dialog-close" id="bkDialogClose"></i>') : '')+
                        '</div>'+
                        (isDefaultType ? '' : (this.hasHeader ? ('<div class="bk-dialog-header">'+
                            '<h3 class="bk-dialog-title">' + this.title + '</h3>'+
                        '</div>') : ''))+
                        (this.content === false ? '<p style="padding-top: 15px;"></p>' : ('<div class="bk-dialog-body ' + (isDefaultType ? 'bk-dialog-default-status' : '') + '" style="'+(this.padding === false ? '' : ('padding: '+this.padding+'px; '))+'">'+
                          body+
                        '</div>'))+
                        (isDefaultType && type !== 'warning' ? '' : ('<div class="bk-dialog-footer '+(type === 'dialog' ? 'bk-dialog-outer' : '')+'">'+
                            '<button type="button" name="confirm" class="bk-dialog-btn bk-dialog-btn-confirm '+(isStyle ? '' : ('bk-btn-' + this.style))+'" style="'+(isStyle ? ('background-color: ' + this.style + '; border-color: ' + this.style + '; color: #fff;') : '')+'" id="bkDialogConfirm">'+this.confirm+'</button>'+
                            '<button type="button" name="cancel" class="bk-dialog-btn bk-dialog-btn-cancel" id="bkDialogCancel">'+this.cancel+'</button>'+
                        '</div>'))+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>';

        this._html = html;

        document.body.appendChild(_compile(this._html));

        setTimeout(function() {
          _initEvent.call(_this);
        }, 10);
    }

    /**
     *  鍒濆鍖栧嚱鏁扮粦瀹�
     */
    var _initEvent = function() {
      var $root = document.querySelector('#bkDialog'),
          confirmBtn = $root.querySelector('#bkDialogConfirm'),
          cancelBtn = $root.querySelector('#bkDialogCancel'),
          closeIcon = $root.querySelector('#bkDialogClose'),
          _this = this;


      $root.addEventListener('click', function(e) {
        if(_this.quickClose && e.target.getAttribute('id') == 'bkDialog') {
          _close.call(_this);
        }
      }, false);

      if(confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            _this.confirmFn && _this.confirmFn(_this);
            _close.call(_this);
        }, false);
      }

      if(cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            _this.cancelFn && _this.cancelFn(_this);
            _close.call(_this);
        }, false);
      }

      if(closeIcon) {
        closeIcon.addEventListener('click', function(e) {
            _close.call(_this);
        }, false);
      }
    }

    /**
     *  鍏抽棴dialog
     */
    var _close = function() {
      var root = document.querySelector('#bkDialog');

      this.onClose && this.onClose(this);
      root.parentNode.removeChild(root);
    }

    // 澶栭儴API
    bkDialog.prototype.show = function() {
      var _this = this,
          root = document.querySelector('#bkDialog');

      if(!root) {
        return;
      }

      setTimeout(function() {
        root.className = root.className.replace('hidden', '');
        this.onShow && this.onShow(this);
      }, 0);
    }

    bkDialog.prototype.close = function() {
      document.querySelector('#bkDialog').className += 'hidden';
    }

    bkDialog.prototype.remove = function() {
      this.close();
      _close.call(this);
    }

    bkDialog.prototype.setTitle = function(text) {
      document.querySelector('#bkDialog .bk-dialog-header > .bk-dialog-title').innerText = text;
    }

    bkDialog.prototype.setContent = function(html) {
      document.querySelector('#bkDialog .bk-dialog-body').innerHTML = html;
    }

    bkDialog.prototype.setWidth = function(num) {
      document.querySelector('#bkDialog .bk-dialog-wrapper').style.width = num.toString() + 'px';
    }

    return bkDialog;
}));