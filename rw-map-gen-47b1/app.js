!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).pako=t()}}(function(){return function r(s,o,l){function h(e,t){if(!o[e]){if(!s[e]){var a="function"==typeof require&&require;if(!t&&a)return a(e,!0);if(d)return d(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[e]={exports:{}};s[e][0].call(n.exports,function(t){return h(s[e][1][t]||t)},n,n.exports,r,s,o,l)}return o[e].exports}for(var d="function"==typeof require&&require,t=0;t<l.length;t++)h(l[t]);return h}({1:[function(t,e,a){"use strict";var s=t("./zlib/deflate"),o=t("./utils/common"),l=t("./utils/strings"),n=t("./zlib/messages"),r=t("./zlib/zstream"),h=Object.prototype.toString,d=0,f=-1,_=0,u=8;function c(t){if(!(this instanceof c))return new c(t);this.options=o.assign({level:f,method:u,chunkSize:16384,windowBits:15,memLevel:8,strategy:_,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new r,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==d)throw new Error(n[a]);if(e.header&&s.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?l.string2buf(e.dictionary):"[object ArrayBuffer]"===h.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(a=s.deflateSetDictionary(this.strm,i))!==d)throw new Error(n[a]);this._dict_set=!0}}function i(t,e){var a=new c(e);if(a.push(t,!0),a.err)throw a.msg||n[a.err];return a.result}c.prototype.push=function(t,e){var a,i,n=this.strm,r=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=l.string2buf(t):"[object ArrayBuffer]"===h.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(r),n.next_out=0,n.avail_out=r),1!==(a=s.deflate(n,i))&&a!==d)return this.onEnd(a),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(l.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==a);return 4===i?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===d):2!==i||(this.onEnd(d),!(n.avail_out=0))},c.prototype.onData=function(t){this.chunks.push(t)},c.prototype.onEnd=function(t){t===d&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=c,a.deflate=i,a.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},a.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":3,"./utils/strings":4,"./zlib/deflate":8,"./zlib/messages":13,"./zlib/zstream":15}],2:[function(t,e,a){"use strict";var f=t("./zlib/inflate"),_=t("./utils/common"),u=t("./utils/strings"),c=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),r=t("./zlib/gzheader"),b=Object.prototype.toString;function s(t){if(!(this instanceof s))return new s(t);this.options=_.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var a=f.inflateInit2(this.strm,e.windowBits);if(a!==c.Z_OK)throw new Error(i[a]);if(this.header=new r,f.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=u.string2buf(e.dictionary):"[object ArrayBuffer]"===b.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=f.inflateSetDictionary(this.strm,e.dictionary))!==c.Z_OK))throw new Error(i[a])}function o(t,e){var a=new s(e);if(a.push(t,!0),a.err)throw a.msg||i[a.err];return a.result}s.prototype.push=function(t,e){var a,i,n,r,s,o=this.strm,l=this.options.chunkSize,h=this.options.dictionary,d=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?c.Z_FINISH:c.Z_NO_FLUSH,"string"==typeof t?o.input=u.binstring2buf(t):"[object ArrayBuffer]"===b.call(t)?o.input=new Uint8Array(t):o.input=t,o.next_in=0,o.avail_in=o.input.length;do{if(0===o.avail_out&&(o.output=new _.Buf8(l),o.next_out=0,o.avail_out=l),(a=f.inflate(o,c.Z_NO_FLUSH))===c.Z_NEED_DICT&&h&&(a=f.inflateSetDictionary(this.strm,h)),a===c.Z_BUF_ERROR&&!0===d&&(a=c.Z_OK,d=!1),a!==c.Z_STREAM_END&&a!==c.Z_OK)return this.onEnd(a),!(this.ended=!0);o.next_out&&(0!==o.avail_out&&a!==c.Z_STREAM_END&&(0!==o.avail_in||i!==c.Z_FINISH&&i!==c.Z_SYNC_FLUSH)||("string"===this.options.to?(n=u.utf8border(o.output,o.next_out),r=o.next_out-n,s=u.buf2string(o.output,n),o.next_out=r,o.avail_out=l-r,r&&_.arraySet(o.output,o.output,n,r,0),this.onData(s)):this.onData(_.shrinkBuf(o.output,o.next_out)))),0===o.avail_in&&0===o.avail_out&&(d=!0)}while((0<o.avail_in||0===o.avail_out)&&a!==c.Z_STREAM_END);return a===c.Z_STREAM_END&&(i=c.Z_FINISH),i===c.Z_FINISH?(a=f.inflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===c.Z_OK):i!==c.Z_SYNC_FLUSH||(this.onEnd(c.Z_OK),!(o.avail_out=0))},s.prototype.onData=function(t){this.chunks.push(t)},s.prototype.onEnd=function(t){t===c.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=_.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Inflate=s,a.inflate=o,a.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},a.ungzip=o},{"./utils/common":3,"./utils/strings":4,"./zlib/constants":6,"./zlib/gzheader":9,"./zlib/inflate":11,"./zlib/messages":13,"./zlib/zstream":15}],3:[function(t,e,a){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e,a,i=Array.prototype.slice.call(arguments,1);i.length;){var n=i.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(var r in n)e=n,a=r,Object.prototype.hasOwnProperty.call(e,a)&&(t[r]=n[r])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,a,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(a,a+i),n);else for(var r=0;r<i;r++)t[n+r]=e[a+r]},flattenChunks:function(t){var e,a,i,n,r,s;for(e=i=0,a=t.length;e<a;e++)i+=t[e].length;for(s=new Uint8Array(i),e=n=0,a=t.length;e<a;e++)r=t[e],s.set(r,n),n+=r.length;return s}},r={arraySet:function(t,e,a,i,n){for(var r=0;r<i;r++)t[n+r]=e[a+r]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,n)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,r))},a.setTyped(i)},{}],4:[function(t,e,a){"use strict";var l=t("./common"),n=!0,r=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){r=!1}for(var h=new l.Buf8(256),i=0;i<256;i++)h[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function d(t,e){if(e<65534&&(t.subarray&&r||!t.subarray&&n))return String.fromCharCode.apply(null,l.shrinkBuf(t,e));for(var a="",i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a}h[254]=h[254]=1,a.string2buf=function(t){var e,a,i,n,r,s=t.length,o=0;for(n=0;n<s;n++)55296==(64512&(a=t.charCodeAt(n)))&&n+1<s&&56320==(64512&(i=t.charCodeAt(n+1)))&&(a=65536+(a-55296<<10)+(i-56320),n++),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new l.Buf8(o),n=r=0;r<o;n++)55296==(64512&(a=t.charCodeAt(n)))&&n+1<s&&56320==(64512&(i=t.charCodeAt(n+1)))&&(a=65536+(a-55296<<10)+(i-56320),n++),a<128?e[r++]=a:(a<2048?e[r++]=192|a>>>6:(a<65536?e[r++]=224|a>>>12:(e[r++]=240|a>>>18,e[r++]=128|a>>>12&63),e[r++]=128|a>>>6&63),e[r++]=128|63&a);return e},a.buf2binstring=function(t){return d(t,t.length)},a.binstring2buf=function(t){for(var e=new l.Buf8(t.length),a=0,i=e.length;a<i;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,i,n,r,s=e||t.length,o=new Array(2*s);for(a=i=0;a<s;)if((n=t[a++])<128)o[i++]=n;else if(4<(r=h[n]))o[i++]=65533,a+=r-1;else{for(n&=2===r?31:3===r?15:7;1<r&&a<s;)n=n<<6|63&t[a++],r--;1<r?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return d(o,i)},a.utf8border=function(t,e){var a;for((e=e||t.length)>t.length&&(e=t.length),a=e-1;0<=a&&128==(192&t[a]);)a--;return a<0?e:0===a?e:a+h[t[a]]>e?a:e}},{"./common":3}],5:[function(t,e,a){"use strict";e.exports=function(t,e,a,i){for(var n=65535&t|0,r=t>>>16&65535|0,s=0;0!==a;){for(a-=s=2e3<a?2e3:a;r=r+(n=n+e[i++]|0)|0,--s;);n%=65521,r%=65521}return n|r<<16|0}},{}],6:[function(t,e,a){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],7:[function(t,e,a){"use strict";var o=function(){for(var t,e=[],a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}();e.exports=function(t,e,a,i){var n=o,r=i+a;t^=-1;for(var s=i;s<r;s++)t=t>>>8^n[255&(t^e[s])];return-1^t}},{}],8:[function(t,e,a){"use strict";var l,_=t("../utils/common"),h=t("./trees"),u=t("./adler32"),c=t("./crc32"),i=t("./messages"),d=0,f=4,b=0,g=-2,m=-1,w=4,n=2,p=8,v=9,r=286,s=30,o=19,k=2*r+1,y=15,x=3,z=258,B=z+x+1,S=42,E=113,A=1,Z=2,R=3,C=4;function N(t,e){return t.msg=i[e],e}function O(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function I(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(_.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function U(t,e){h._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,I(t.strm)}function T(t,e){t.pending_buf[t.pending++]=e}function F(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var a,i,n=t.max_chain_length,r=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-B?t.strstart-(t.w_size-B):0,h=t.window,d=t.w_mask,f=t.prev,_=t.strstart+z,u=h[r+s-1],c=h[r+s];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(h[(a=e)+s]===c&&h[a+s-1]===u&&h[a]===h[r]&&h[++a]===h[r+1]){r+=2,a++;do{}while(h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&r<_);if(i=z-(_-r),r=_-z,s<i){if(t.match_start=e,o<=(s=i))break;u=h[r+s-1],c=h[r+s]}}}while((e=f[e&d])>l&&0!=--n);return s<=t.lookahead?s:t.lookahead}function H(t){var e,a,i,n,r,s,o,l,h,d,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-B)){for(_.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=a=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--a;);for(e=a=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--a;);n+=f}if(0===t.strm.avail_in)break;if(s=t.strm,o=t.window,l=t.strstart+t.lookahead,h=n,d=void 0,d=s.avail_in,h<d&&(d=h),a=0===d?0:(s.avail_in-=d,_.arraySet(o,s.input,s.next_in,d,l),1===s.state.wrap?s.adler=u(s.adler,o,d,l):2===s.state.wrap&&(s.adler=c(s.adler,o,d,l)),s.next_in+=d,s.total_in+=d,d),t.lookahead+=a,t.lookahead+t.insert>=x)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+x-1])&t.hash_mask,t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<B&&0!==t.strm.avail_in)}function j(t,e){for(var a,i;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===d)return A;if(0===t.lookahead)break}if(a=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-B&&(t.match_length=L(t,a)),t.match_length>=x)if(i=h._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}function K(t,e){for(var a,i,n;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===d)return A;if(0===t.lookahead)break}if(a=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-B&&(t.match_length=L(t,a),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=h._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(U(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=h._tr_tally(t,0,t.window[t.strstart-1]))&&U(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=h._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}function M(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}function P(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=p,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new _.Buf16(2*k),this.dyn_dtree=new _.Buf16(2*(2*s+1)),this.bl_tree=new _.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new _.Buf16(y+1),this.heap=new _.Buf16(2*r+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new _.Buf16(2*r+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function Y(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?S:E,t.adler=2===e.wrap?0:1,e.last_flush=d,h._tr_init(e),b):N(t,g)}function q(t){var e,a=Y(t);return a===b&&((e=t.state).window_size=2*e.w_size,D(e.head),e.max_lazy_match=l[e.level].max_lazy,e.good_match=l[e.level].good_length,e.nice_match=l[e.level].nice_length,e.max_chain_length=l[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0),a}function G(t,e,a,i,n,r){if(!t)return g;var s=1;if(e===m&&(e=6),i<0?(s=0,i=-i):15<i&&(s=2,i-=16),n<1||v<n||a!==p||i<8||15<i||e<0||9<e||r<0||w<r)return N(t,g);8===i&&(i=9);var o=new P;return(t.state=o).strm=t,o.wrap=s,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new _.Buf8(2*o.w_size),o.head=new _.Buf16(o.hash_size),o.prev=new _.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new _.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=r,o.method=a,q(t)}l=[new M(0,0,0,0,function(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(H(t),0===t.lookahead&&e===d)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,U(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-B&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):(t.strstart>t.block_start&&(U(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,j),new M(4,5,16,8,j),new M(4,6,32,32,j),new M(4,4,16,16,K),new M(8,16,32,32,K),new M(8,16,128,128,K),new M(8,32,128,256,K),new M(32,128,258,1024,K),new M(32,258,258,4096,K)],a.deflateInit=function(t,e){return G(t,e,p,15,8,0)},a.deflateInit2=G,a.deflateReset=q,a.deflateResetKeep=Y,a.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?g:(t.state.gzhead=e,b):g},a.deflate=function(t,e){var a,i,n,r;if(!t||!t.state||5<e||e<0)return t?N(t,g):g;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return N(t,0===t.avail_out?-5:g);if(i.strm=t,a=i.last_flush,i.last_flush=e,i.status===S)if(2===i.wrap)t.adler=0,T(i,31),T(i,139),T(i,8),i.gzhead?(T(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),T(i,255&i.gzhead.time),T(i,i.gzhead.time>>8&255),T(i,i.gzhead.time>>16&255),T(i,i.gzhead.time>>24&255),T(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),T(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(T(i,255&i.gzhead.extra.length),T(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=c(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(T(i,0),T(i,0),T(i,0),T(i,0),T(i,0),T(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),T(i,3),i.status=E);else{var s=p+(i.w_bits-8<<4)<<8;s|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(s|=32),s+=31-s%31,i.status=E,F(i,s),0!==i.strstart&&(F(i,t.adler>>>16),F(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending!==i.pending_buf_size));)T(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending===i.pending_buf_size)){r=1;break}T(i,r=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0)}while(0!==r);i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),0===r&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending===i.pending_buf_size)){r=1;break}T(i,r=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0)}while(0!==r);i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),0===r&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&I(t),i.pending+2<=i.pending_buf_size&&(T(i,255&t.adler),T(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(I(t),0===t.avail_out)return i.last_flush=-1,b}else if(0===t.avail_in&&O(e)<=O(a)&&e!==f)return N(t,-5);if(666===i.status&&0!==t.avail_in)return N(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==d&&666!==i.status){var o=2===i.strategy?function(t,e){for(var a;;){if(0===t.lookahead&&(H(t),0===t.lookahead)){if(e===d)return A;break}if(t.match_length=0,a=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}(i,e):3===i.strategy?function(t,e){for(var a,i,n,r,s=t.window;;){if(t.lookahead<=z){if(H(t),t.lookahead<=z&&e===d)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=s[n=t.strstart-1])===s[++n]&&i===s[++n]&&i===s[++n]){r=t.strstart+z;do{}while(i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&n<r);t.match_length=z-(r-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(a=h._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}(i,e):l[i.level].func(i,e);if(o!==R&&o!==C||(i.status=666),o===A||o===R)return 0===t.avail_out&&(i.last_flush=-1),b;if(o===Z&&(1===e?h._tr_align(i):5!==e&&(h._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),I(t),0===t.avail_out))return i.last_flush=-1,b}return e!==f?b:i.wrap<=0?1:(2===i.wrap?(T(i,255&t.adler),T(i,t.adler>>8&255),T(i,t.adler>>16&255),T(i,t.adler>>24&255),T(i,255&t.total_in),T(i,t.total_in>>8&255),T(i,t.total_in>>16&255),T(i,t.total_in>>24&255)):(F(i,t.adler>>>16),F(i,65535&t.adler)),I(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?b:1)},a.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==S&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?N(t,g):(t.state=null,e===E?N(t,-3):b):g},a.deflateSetDictionary=function(t,e){var a,i,n,r,s,o,l,h,d=e.length;if(!t||!t.state)return g;if(2===(r=(a=t.state).wrap)||1===r&&a.status!==S||a.lookahead)return g;for(1===r&&(t.adler=u(t.adler,e,d,0)),a.wrap=0,d>=a.w_size&&(0===r&&(D(a.head),a.strstart=0,a.block_start=0,a.insert=0),h=new _.Buf8(a.w_size),_.arraySet(h,e,d-a.w_size,a.w_size,0),e=h,d=a.w_size),s=t.avail_in,o=t.next_in,l=t.input,t.avail_in=d,t.next_in=0,t.input=e,H(a);a.lookahead>=x;){for(i=a.strstart,n=a.lookahead-(x-1);a.ins_h=(a.ins_h<<a.hash_shift^a.window[i+x-1])&a.hash_mask,a.prev[i&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=i,i++,--n;);a.strstart=i,a.lookahead=x-1,H(a)}return a.strstart+=a.lookahead,a.block_start=a.strstart,a.insert=a.lookahead,a.lookahead=0,a.match_length=a.prev_length=x-1,a.match_available=0,t.next_in=o,t.input=l,t.avail_in=s,a.wrap=r,b},a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":3,"./adler32":5,"./crc32":7,"./messages":13,"./trees":14}],9:[function(t,e,a){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],10:[function(t,e,a){"use strict";e.exports=function(t,e){var a,i,n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,y,x,z,B,S;a=t.state,i=t.next_in,B=t.input,n=i+(t.avail_in-5),r=t.next_out,S=t.output,s=r-(e-t.avail_out),o=r+(t.avail_out-257),l=a.dmax,h=a.wsize,d=a.whave,f=a.wnext,_=a.window,u=a.hold,c=a.bits,b=a.lencode,g=a.distcode,m=(1<<a.lenbits)-1,w=(1<<a.distbits)-1;t:do{c<15&&(u+=B[i++]<<c,c+=8,u+=B[i++]<<c,c+=8),p=b[u&m];e:for(;;){if(u>>>=v=p>>>24,c-=v,0===(v=p>>>16&255))S[r++]=65535&p;else{if(!(16&v)){if(0==(64&v)){p=b[(65535&p)+(u&(1<<v)-1)];continue e}if(32&v){a.mode=12;break t}t.msg="invalid literal/length code",a.mode=30;break t}k=65535&p,(v&=15)&&(c<v&&(u+=B[i++]<<c,c+=8),k+=u&(1<<v)-1,u>>>=v,c-=v),c<15&&(u+=B[i++]<<c,c+=8,u+=B[i++]<<c,c+=8),p=g[u&w];a:for(;;){if(u>>>=v=p>>>24,c-=v,!(16&(v=p>>>16&255))){if(0==(64&v)){p=g[(65535&p)+(u&(1<<v)-1)];continue a}t.msg="invalid distance code",a.mode=30;break t}if(y=65535&p,c<(v&=15)&&(u+=B[i++]<<c,(c+=8)<v&&(u+=B[i++]<<c,c+=8)),l<(y+=u&(1<<v)-1)){t.msg="invalid distance too far back",a.mode=30;break t}if(u>>>=v,c-=v,(v=r-s)<y){if(d<(v=y-v)&&a.sane){t.msg="invalid distance too far back",a.mode=30;break t}if(z=_,(x=0)===f){if(x+=h-v,v<k){for(k-=v;S[r++]=_[x++],--v;);x=r-y,z=S}}else if(f<v){if(x+=h+f-v,(v-=f)<k){for(k-=v;S[r++]=_[x++],--v;);if(x=0,f<k){for(k-=v=f;S[r++]=_[x++],--v;);x=r-y,z=S}}}else if(x+=f-v,v<k){for(k-=v;S[r++]=_[x++],--v;);x=r-y,z=S}for(;2<k;)S[r++]=z[x++],S[r++]=z[x++],S[r++]=z[x++],k-=3;k&&(S[r++]=z[x++],1<k&&(S[r++]=z[x++]))}else{for(x=r-y;S[r++]=S[x++],S[r++]=S[x++],S[r++]=S[x++],2<(k-=3););k&&(S[r++]=S[x++],1<k&&(S[r++]=S[x++]))}break}}break}}while(i<n&&r<o);i-=k=c>>3,u&=(1<<(c-=k<<3))-1,t.next_in=i,t.next_out=r,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=r<o?o-r+257:257-(r-o),a.hold=u,a.bits=c}},{}],11:[function(t,e,a){"use strict";var Z=t("../utils/common"),R=t("./adler32"),C=t("./crc32"),N=t("./inffast"),O=t("./inftrees"),D=1,I=2,U=0,T=-2,F=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function r(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Z.Buf16(320),this.work=new Z.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function s(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=F,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Z.Buf32(i),e.distcode=e.distdyn=new Z.Buf32(n),e.sane=1,e.back=-1,U):T}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,s(t)):T}function l(t,e){var a,i;return t&&t.state?(i=t.state,e<0?(a=0,e=-e):(a=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?T:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,o(t))):T}function h(t,e){var a,i;return t?(i=new r,(t.state=i).window=null,(a=l(t,e))!==U&&(t.state=null),a):T}var d,f,_=!0;function H(t){if(_){var e;for(d=new Z.Buf32(512),f=new Z.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(O(D,t.lens,0,288,d,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;O(I,t.lens,0,32,f,0,t.work,{bits:5}),_=!1}t.lencode=d,t.lenbits=9,t.distcode=f,t.distbits=5}function j(t,e,a,i){var n,r=t.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new Z.Buf8(r.wsize)),i>=r.wsize?(Z.arraySet(r.window,e,a-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(i<(n=r.wsize-r.wnext)&&(n=i),Z.arraySet(r.window,e,a-i,n,r.wnext),(i-=n)?(Z.arraySet(r.window,e,a-i,i,0),r.wnext=i,r.whave=r.wsize):(r.wnext+=n,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=n))),0}a.inflateReset=o,a.inflateReset2=l,a.inflateResetKeep=s,a.inflateInit=function(t){return h(t,15)},a.inflateInit2=h,a.inflate=function(t,e){var a,i,n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,y,x,z,B,S=0,E=new Z.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return T;12===(a=t.state).mode&&(a.mode=13),s=t.next_out,n=t.output,l=t.avail_out,r=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,f=o,_=l,x=U;t:for(;;)switch(a.mode){case F:if(0===a.wrap){a.mode=13;break}for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(2&a.wrap&&35615===h){E[a.check=0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0),d=h=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=30;break}if(8!=(15&h)){t.msg="unknown compression method",a.mode=30;break}if(d-=4,y=8+(15&(h>>>=4)),0===a.wbits)a.wbits=y;else if(y>a.wbits){t.msg="invalid window size",a.mode=30;break}a.dmax=1<<y,t.adler=a.check=1,a.mode=512&h?10:12,d=h=0;break;case 2:for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(a.flags=h,8!=(255&a.flags)){t.msg="unknown compression method",a.mode=30;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=30;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0,a.mode=3;case 3:for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,E[2]=h>>>16&255,E[3]=h>>>24&255,a.check=C(a.check,E,4,0)),d=h=0,a.mode=4;case 4:for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0,a.mode=5;case 5:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(o<(u=a.length)&&(u=o),u&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),Z.arraySet(a.head.extra,i,r,u,y)),512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,a.length-=u),a.length))break t;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(0===o)break t;for(u=0;y=i[r+u++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y)),y&&u<o;);if(512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(0===o)break t;for(u=0;y=i[r+u++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y)),y&&u<o;);if(512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,y)break t}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=30;break}d=h=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=12;break;case 10:for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}t.adler=a.check=L(h),d=h=0,a.mode=11;case 11:if(0===a.havedict)return t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,2;t.adler=a.check=1,a.mode=12;case 12:if(5===e||6===e)break t;case 13:if(a.last){h>>>=7&d,d-=7&d,a.mode=27;break}for(;d<3;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}switch(a.last=1&h,d-=1,3&(h>>>=1)){case 0:a.mode=14;break;case 1:if(H(a),a.mode=20,6!==e)break;h>>>=2,d-=2;break t;case 2:a.mode=17;break;case 3:t.msg="invalid block type",a.mode=30}h>>>=2,d-=2;break;case 14:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=30;break}if(a.length=65535&h,d=h=0,a.mode=15,6===e)break t;case 15:a.mode=16;case 16:if(u=a.length){if(o<u&&(u=o),l<u&&(u=l),0===u)break t;Z.arraySet(n,i,r,u,s),o-=u,r+=u,l-=u,s+=u,a.length-=u;break}a.mode=12;break;case 17:for(;d<14;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,286<a.nlen||30<a.ndist){t.msg="too many length or distance symbols",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.lens[A[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[A[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,z={bits:a.lenbits},x=O(0,a.lens,0,19,a.lencode,0,a.work,z),a.lenbits=z.bits,x){t.msg="invalid code lengths set",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;m=(S=a.lencode[h&(1<<a.lenbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(w<16)h>>>=g,d-=g,a.lens[a.have++]=w;else{if(16===w){for(B=g+2;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h>>>=g,d-=g,0===a.have){t.msg="invalid bit length repeat",a.mode=30;break}y=a.lens[a.have-1],u=3+(3&h),h>>>=2,d-=2}else if(17===w){for(B=g+3;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}d-=g,y=0,u=3+(7&(h>>>=g)),h>>>=3,d-=3}else{for(B=g+7;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}d-=g,y=0,u=11+(127&(h>>>=g)),h>>>=7,d-=7}if(a.have+u>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=30;break}for(;u--;)a.lens[a.have++]=y}}if(30===a.mode)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=30;break}if(a.lenbits=9,z={bits:a.lenbits},x=O(D,a.lens,0,a.nlen,a.lencode,0,a.work,z),a.lenbits=z.bits,x){t.msg="invalid literal/lengths set",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,z={bits:a.distbits},x=O(I,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,z),a.distbits=z.bits,x){t.msg="invalid distances set",a.mode=30;break}if(a.mode=20,6===e)break t;case 20:a.mode=21;case 21:if(6<=o&&258<=l){t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,N(t,_),s=t.next_out,n=t.output,l=t.avail_out,r=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,12===a.mode&&(a.back=-1);break}for(a.back=0;m=(S=a.lencode[h&(1<<a.lenbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(m&&0==(240&m)){for(p=g,v=m,k=w;m=(S=a.lencode[k+((h&(1<<p+v)-1)>>p)])>>>16&255,w=65535&S,!(p+(g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=g,d-=g,a.back+=g,a.length=w,0===m){a.mode=26;break}if(32&m){a.back=-1,a.mode=12;break}if(64&m){t.msg="invalid literal/length code",a.mode=30;break}a.extra=15&m,a.mode=22;case 22:if(a.extra){for(B=a.extra;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;m=(S=a.distcode[h&(1<<a.distbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(0==(240&m)){for(p=g,v=m,k=w;m=(S=a.distcode[k+((h&(1<<p+v)-1)>>p)])>>>16&255,w=65535&S,!(p+(g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=g,d-=g,a.back+=g,64&m){t.msg="invalid distance code",a.mode=30;break}a.offset=w,a.extra=15&m,a.mode=24;case 24:if(a.extra){for(B=a.extra;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=30;break}a.mode=25;case 25:if(0===l)break t;if(u=_-l,a.offset>u){if((u=a.offset-u)>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=30;break}u>a.wnext?(u-=a.wnext,c=a.wsize-u):c=a.wnext-u,u>a.length&&(u=a.length),b=a.window}else b=n,c=s-a.offset,u=a.length;for(l<u&&(u=l),l-=u,a.length-=u;n[s++]=b[c++],--u;);0===a.length&&(a.mode=21);break;case 26:if(0===l)break t;n[s++]=a.length,l--,a.mode=21;break;case 27:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[r++]<<d,d+=8}if(_-=l,t.total_out+=_,a.total+=_,_&&(t.adler=a.check=a.flags?C(a.check,n,_,s-_):R(a.check,n,_,s-_)),_=l,(a.flags?h:L(h))!==a.check){t.msg="incorrect data check",a.mode=30;break}d=h=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=30;break}d=h=0}a.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return T}return t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||_!==t.avail_out&&a.mode<30&&(a.mode<27||4!==e))&&j(t,t.output,t.next_out,_-t.avail_out)?(a.mode=31,-4):(f-=t.avail_in,_-=t.avail_out,t.total_in+=f,t.total_out+=_,a.total+=_,a.wrap&&_&&(t.adler=a.check=a.flags?C(a.check,n,_,t.next_out-_):R(a.check,n,_,t.next_out-_)),t.data_type=a.bits+(a.last?64:0)+(12===a.mode?128:0)+(20===a.mode||15===a.mode?256:0),(0===f&&0===_||4===e)&&x===U&&(x=-5),x)},a.inflateEnd=function(t){if(!t||!t.state)return T;var e=t.state;return e.window&&(e.window=null),t.state=null,U},a.inflateGetHeader=function(t,e){var a;return t&&t.state?0==(2&(a=t.state).wrap)?T:((a.head=e).done=!1,U):T},a.inflateSetDictionary=function(t,e){var a,i=e.length;return t&&t.state?0!==(a=t.state).wrap&&11!==a.mode?T:11===a.mode&&R(1,e,i,0)!==a.check?-3:j(t,e,i,i)?(a.mode=31,-4):(a.havedict=1,U):T},a.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":3,"./adler32":5,"./crc32":7,"./inffast":10,"./inftrees":12}],12:[function(t,e,a){"use strict";var D=t("../utils/common"),I=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],U=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],T=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],F=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,a,i,n,r,s,o){var l,h,d,f,_,u,c,b,g,m=o.bits,w=0,p=0,v=0,k=0,y=0,x=0,z=0,B=0,S=0,E=0,A=null,Z=0,R=new D.Buf16(16),C=new D.Buf16(16),N=null,O=0;for(w=0;w<=15;w++)R[w]=0;for(p=0;p<i;p++)R[e[a+p]]++;for(y=m,k=15;1<=k&&0===R[k];k--);if(k<y&&(y=k),0===k)return n[r++]=20971520,n[r++]=20971520,o.bits=1,0;for(v=1;v<k&&0===R[v];v++);for(y<v&&(y=v),w=B=1;w<=15;w++)if(B<<=1,(B-=R[w])<0)return-1;if(0<B&&(0===t||1!==k))return-1;for(C[1]=0,w=1;w<15;w++)C[w+1]=C[w]+R[w];for(p=0;p<i;p++)0!==e[a+p]&&(s[C[e[a+p]]++]=p);if(0===t?(A=N=s,u=19):1===t?(A=I,Z-=257,N=U,O-=257,u=256):(A=T,N=F,u=-1),w=v,_=r,z=p=E=0,d=-1,f=(S=1<<(x=y))-1,1===t&&852<S||2===t&&592<S)return 1;for(;;){for(c=w-z,s[p]<u?(b=0,g=s[p]):s[p]>u?(b=N[O+s[p]],g=A[Z+s[p]]):(b=96,g=0),l=1<<w-z,v=h=1<<x;n[_+(E>>z)+(h-=l)]=c<<24|b<<16|g|0,0!==h;);for(l=1<<w-1;E&l;)l>>=1;if(0!==l?(E&=l-1,E+=l):E=0,p++,0==--R[w]){if(w===k)break;w=e[a+s[p]]}if(y<w&&(E&f)!==d){for(0===z&&(z=y),_+=v,B=1<<(x=w-z);x+z<k&&!((B-=R[x+z])<=0);)x++,B<<=1;if(S+=1<<x,1===t&&852<S||2===t&&592<S)return 1;n[d=E&f]=y<<24|x<<16|_-r|0}}return 0!==E&&(n[_+E]=w-z<<24|64<<16|0),o.bits=y,0}},{"../utils/common":3}],13:[function(t,e,a){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],14:[function(t,e,a){"use strict";var l=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var d=0,s=29,f=256,_=f+1+s,u=30,c=19,g=2*_+1,m=15,n=16,b=7,w=256,p=16,v=17,k=18,y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],x=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],z=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],S=new Array(2*(_+2));i(S);var E=new Array(2*u);i(E);var A=new Array(512);i(A);var Z=new Array(256);i(Z);var R=new Array(s);i(R);var C,N,O,D=new Array(u);function I(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function r(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function U(t){return t<256?A[t]:A[256+(t>>>7)]}function T(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function F(t,e,a){t.bi_valid>n-a?(t.bi_buf|=e<<t.bi_valid&65535,T(t,t.bi_buf),t.bi_buf=e>>n-t.bi_valid,t.bi_valid+=a-n):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function L(t,e,a){F(t,a[2*e],a[2*e+1])}function H(t,e){for(var a=0;a|=1&t,t>>>=1,a<<=1,0<--e;);return a>>>1}function j(t,e,a){var i,n,r=new Array(m+1),s=0;for(i=1;i<=m;i++)r[i]=s=s+a[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=H(r[o]++,o))}}function K(t){var e;for(e=0;e<_;e++)t.dyn_ltree[2*e]=0;for(e=0;e<u;e++)t.dyn_dtree[2*e]=0;for(e=0;e<c;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*w]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?T(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function P(t,e,a,i){var n=2*e,r=2*a;return t[n]<t[r]||t[n]===t[r]&&i[e]<=i[a]}function Y(t,e,a){for(var i=t.heap[a],n=a<<1;n<=t.heap_len&&(n<t.heap_len&&P(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!P(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i}function q(t,e,a){var i,n,r,s,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(r=Z[n])+f+1,e),0!==(s=y[r])&&F(t,n-=R[r],s),L(t,r=U(--i),a),0!==(s=x[r])&&F(t,i-=D[r],s)),o<t.last_lit;);L(t,w,e)}function G(t,e){var a,i,n,r=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(t.heap_len=0,t.heap_max=g,a=0;a<l;a++)0!==r[2*a]?(t.heap[++t.heap_len]=h=a,t.depth[a]=0):r[2*a+1]=0;for(;t.heap_len<2;)r[2*(n=t.heap[++t.heap_len]=h<2?++h:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=s[2*n+1]);for(e.max_code=h,a=t.heap_len>>1;1<=a;a--)Y(t,r,a);for(n=l;a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],Y(t,r,1),i=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=i,r[2*n]=r[2*a]+r[2*i],t.depth[n]=(t.depth[a]>=t.depth[i]?t.depth[a]:t.depth[i])+1,r[2*a+1]=r[2*i+1]=n,t.heap[1]=n++,Y(t,r,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var a,i,n,r,s,o,l=e.dyn_tree,h=e.max_code,d=e.stat_desc.static_tree,f=e.stat_desc.has_stree,_=e.stat_desc.extra_bits,u=e.stat_desc.extra_base,c=e.stat_desc.max_length,b=0;for(r=0;r<=m;r++)t.bl_count[r]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;a<g;a++)c<(r=l[2*l[2*(i=t.heap[a])+1]+1]+1)&&(r=c,b++),l[2*i+1]=r,h<i||(t.bl_count[r]++,s=0,u<=i&&(s=_[i-u]),o=l[2*i],t.opt_len+=o*(r+s),f&&(t.static_len+=o*(d[2*i+1]+s)));if(0!==b){do{for(r=c-1;0===t.bl_count[r];)r--;t.bl_count[r]--,t.bl_count[r+1]+=2,t.bl_count[c]--,b-=2}while(0<b);for(r=c;0!==r;r--)for(i=t.bl_count[r];0!==i;)h<(n=t.heap[--a])||(l[2*n+1]!==r&&(t.opt_len+=(r-l[2*n+1])*l[2*n],l[2*n+1]=r),i--)}}(t,e),j(r,h,t.bl_count)}function X(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=s,s=e[2*(i+1)+1],++o<l&&n===s||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==r&&t.bl_tree[2*n]++,t.bl_tree[2*p]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*k]++,r=n,(o=0)===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4))}function W(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),i=0;i<=a;i++)if(n=s,s=e[2*(i+1)+1],!(++o<l&&n===s)){if(o<h)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==r&&(L(t,n,t.bl_tree),o--),L(t,p,t.bl_tree),F(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),F(t,o-3,3)):(L(t,k,t.bl_tree),F(t,o-11,7));r=n,(o=0)===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4)}}i(D);var J=!1;function Q(t,e,a,i){var n,r,s,o;F(t,(d<<1)+(i?1:0),3),r=e,s=a,o=!0,M(n=t),o&&(T(n,s),T(n,~s)),l.arraySet(n.pending_buf,n.window,r,s,n.pending),n.pending+=s}a._tr_init=function(t){J||(function(){var t,e,a,i,n,r=new Array(m+1);for(i=a=0;i<s-1;i++)for(R[i]=a,t=0;t<1<<y[i];t++)Z[a++]=i;for(Z[a-1]=i,i=n=0;i<16;i++)for(D[i]=n,t=0;t<1<<x[i];t++)A[n++]=i;for(n>>=7;i<u;i++)for(D[i]=n<<7,t=0;t<1<<x[i]-7;t++)A[256+n++]=i;for(e=0;e<=m;e++)r[e]=0;for(t=0;t<=143;)S[2*t+1]=8,t++,r[8]++;for(;t<=255;)S[2*t+1]=9,t++,r[9]++;for(;t<=279;)S[2*t+1]=7,t++,r[7]++;for(;t<=287;)S[2*t+1]=8,t++,r[8]++;for(j(S,_+1,r),t=0;t<u;t++)E[2*t+1]=5,E[2*t]=H(t,5);C=new I(S,y,f+1,_,m),N=new I(E,x,0,u,m),O=new I(new Array(0),z,0,c,b)}(),J=!0),t.l_desc=new r(t.dyn_ltree,C),t.d_desc=new r(t.dyn_dtree,N),t.bl_desc=new r(t.bl_tree,O),t.bi_buf=0,t.bi_valid=0,K(t)},a._tr_stored_block=Q,a._tr_flush_block=function(t,e,a,i){var n,r,s=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<f;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),G(t,t.l_desc),G(t,t.d_desc),s=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),G(t,t.bl_desc),e=c-1;3<=e&&0===t.bl_tree[2*B[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(r=t.static_len+3+7>>>3)<=n&&(n=r)):n=r=a+5,a+4<=n&&-1!==e?Q(t,e,a,i):4===t.strategy||r===n?(F(t,2+(i?1:0),3),q(t,S,E)):(F(t,4+(i?1:0),3),function(t,e,a,i){var n;for(F(t,e-257,5),F(t,a-1,5),F(t,i-4,4),n=0;n<i;n++)F(t,t.bl_tree[2*B[n]+1],3);W(t,t.dyn_ltree,e-1),W(t,t.dyn_dtree,a-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),q(t,t.dyn_ltree,t.dyn_dtree)),K(t),i&&M(t)},a._tr_tally=function(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(Z[a]+f+1)]++,t.dyn_dtree[2*U(e)]++),t.last_lit===t.lit_bufsize-1},a._tr_align=function(t){var e;F(t,2,3),L(t,w,S),16===(e=t).bi_valid?(T(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}},{"../utils/common":3}],15:[function(t,e,a){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],"/":[function(t,e,a){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":1,"./lib/inflate":2,"./lib/utils/common":3,"./lib/zlib/constants":6}]},{},[])("/")});


const B64C='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function u8b64(a){
  let o='',i=0,n=a.length;
  for(;i+2<n;i+=3){const b0=a[i],b1=a[i+1],b2=a[i+2];o+=B64C[b0>>2]+B64C[((b0&3)<<4)|(b1>>4)]+B64C[((b1&15)<<2)|(b2>>6)]+B64C[b2&63];}
  if(i<n){const b0=a[i];if(i+1<n){const b1=a[i+1];o+=B64C[b0>>2]+B64C[((b0&3)<<4)|(b1>>4)]+B64C[(b1&15)<<2]+'=';}else{o+=B64C[b0>>2]+B64C[(b0&3)<<4]+'==';}}
  return o;
}

/* ══════ PERLIN ══════ */
class Perlin{
  constructor(s=0){
    this.p=new Uint8Array(512);const q=new Uint8Array(256);
    for(let i=0;i<256;i++) q[i]=i;
    let r=s|0;for(let i=255;i>0;i--){r=(r*1664525+1013904223)&0xffffffff;const j=(r>>>0)%(i+1);[q[i],q[j]]=[q[j],q[i]];}
    for(let i=0;i<512;i++) this.p[i]=q[i&255];
  }
  f(t){return t*t*t*(t*(t*6-15)+10)}
  l(a,b,t){return a+t*(b-a)}
  g(h,x,y){const u=h<2?x:y,v=h<2?y:x;return((h&1)?-u:u)+((h&2)?-v:v)}
  n(x,y){
    const X=Math.floor(x)&255,Y=Math.floor(y)&255;
    x-=Math.floor(x);y-=Math.floor(y);
    const u=this.f(x),v=this.f(y);
    const a=this.p[X]+Y,b=this.p[X+1]+Y;
    return this.l(this.l(this.g(this.p[a],x,y),this.g(this.p[b],x-1,y),u),
                  this.l(this.g(this.p[a+1],x,y-1),this.g(this.p[b+1],x-1,y-1),u),v);
  }
  fbm(x,y,o,p=.5,l=2){let v=0,a=1,f=1,m=0;for(let i=0;i<o;i++){v+=this.n(x*f,y*f)*a;m+=a;a*=p;f*=l;}return v/m;}
}

/* ══════ TILESET DATA ══════ */
const TS={
  terrain_temperate:"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",
  terrain_desert:   "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",
  terrain_arctic:   "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",
  terrain_volcanic: "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",
  misc:  "iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAABJUlEQVR42u3aLU4DQRiA4V2CIASBraviANwAU4PpUWtqanoDDoAah0UQggM1ydfJLO02/Mxunkd1/0zzZvPNZLsOZqT/7uLV6uazdv5j99b765hM0EMhC5vJBV3GfP14e3D9ffsqaqYRdIw5h7x8WG7iPWmf1mXYoqa5oMuYy5BLaZ/WoqY1l+WJWsyru/tF/r17fnrJb+7UHUYN/+3i2CIwxlw7HruQhF8PemgBeIpznoE/CRpmGXTeyYgzc3kc74FW9HH+rY0PQ9t2UV4Y2umgqaDPmYlt3dHcyPETIYqZJmfoMfvK9qBpNuj4hj0lVKMGzc7QkY+TmFXQtajNzUw66GNhCxkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYIQvFkN3sV0/McYAAAAASUVORK5CYII=",
  units: "iVBORw0KGgoAAAANSUhEUgAAAKAAAAAUCAYAAAAKlDZOAAACwklEQVR42u2ZTUhUURiGTzJSSGDQD10YLi40+kEXF4pZiCRJi064SG0RLRyYRdfEpQjCZRgIxGWo02LAFtGitIV0WoRRhAspuAujH8qFDAMTaZAgUijUKvDm173v8Tth0XlWn8fhWT2ee8dPCIvFYvlf2fNz+P78wjxL1PYos/Xn5dZWlu/w3FzEd2VineW721cX8XkLOZYvbClFfM9ymyzf2VIq4vuSu8fyHShdjvg2Cx7LlwrCiM9dWGT5yi2NGSGEqLF/g5bdJLXt5umeP6QjWJ7KrMT9/sT7N1q+t8dOxvoe59NavvP5Sqyv3PFAy+fOXor1dc8c0fJNdX6K9TXOXNPyLXbeivUdHVvS8n3sb4j1rXec0fLVzb5YiQ1QCCGuy4PvENm4+nwc+Vx2337IN/l1DfI5p33IV31ZhHy1XQ2Qb2N6CfJdTPdDvoeVMciXS5+DfKXKE8jXd2ov5Jt4/Q3ybXRdhXy103e2+aBHcD7bJPPZJmnq2h10XTnousZ8zXJYNsthYz7H96Tje8Z8vV4ge73AmG/I65FDXo8xX9DuyKDdMear9wdkvT8A+WqQ+KiZEx81c+KjZk581MyJj5o58VEzJz5q5sRHzTsKkAqOEyEVHCdCKjhOhFRwnAip4DgRUsFxIqSC40RIBZcUof0WbNlV4m/AyQ8KOUMZLZcVcobySt1QyBlKtRgq5AzldlhQyBnKSHhfIWcohadVhZyhrBZvKuRM7x1wS3Cc+KjgOPFRwXHio4LjxEcFx4mPCo4THxUcJz4quKT4fvtvGJO3HnoTmorQBCbCM3XroTehqQhNgIRn3wEtf/87oMXypyEfweiGAwXdcMCPSHDDgYJuOFDQDQcKuuFAQTccKNSGY8cBJu12dUna7eqStNvVJWm3q0vSbleXpN2uLkm7XV1+3e3aR7DFYrFYLP8EPwD4uDCJjwQT7gAAAABJRU5ErkJggg==",
};

/* ══════ I18N ══════ */
const LANG_DATA = {"ru": {"title": "RUSTED WARFARE", "subtitle": "Генератор карт", "generate": "⟳ Сгенерировать", "export": "💾 Экспорт TMX", "auto": "🎲 Авто", "view": "Вид", "spawn": "Спавн", "resource": "Ресурс", "erase": "Стереть", "settings": "Настройки", "generation": "Генерация", "size": "Размер", "noise": "Шум", "octaves": "Октавы", "water": "Вода", "biome": "Биом", "temperate": "🌿 Умеренный", "desert": "🏜 Пустыня", "arctic": "❄ Арктика", "volcanic": "🌋 Вулкан", "continents": "🏝 Острова", "archipelago": "⛰ Горный", "flat": "🌊 Прибрежный", "seed": "Сид", "seed_ph": "Сид (авто)", "shape": "Форма карты", "island": "Остров", "mainland": "Материк", "lakes": "Озёра", "maze": "Лабиринт", "symmetry": "Симметрия", "sym_none": "Нет", "sym_h": "↔ Горизонт.", "sym_v": "↕ Вертикал.", "sym_4": "✦ 4x", "players": "Игроков", "team_spawn": "Команда спавна", "stats": "Метки", "spawns": "Спавны", "resources": "Ресурсы", "export_lbl": "Экспорт", "export_note": "Один .tmx файл. Скинь в", "export_note2": "/sdcard/Rusted Warfare/maps/", "download_tmx": "↓ Скачать .tmx", "save_png": "🖼 PNG", "clear": "✕ Очистить метки", "auto_title": "🎲 Авто-расстановка", "auto_note": "Авто-расставит спавны и ресурсы по выбранному режиму.", "1v1": "⚔ 1 vs 1", "2v2": "🤝 2 vs 2", "ffa3": "🔥 FFA 3", "ffa4": "💥 FFA 4", "1v4": "🎯 1 vs 4", "no_map": "Нет карты", "no_water": "Нельзя на воду!", "need_map": "Сначала сгенерируй карту!", "terrain": {"deep": "🌊 Глубина", "shore": "〰 Берег", "beach": "🏖 Пляж", "plain": "🌿 Равнина", "grass": "🌱 Луга", "forest": "🌲 Лес", "rock": "⛰ Скалы", "mountain": "🏔 Горы", "snow": "❄ Вершины"}, "export_spawns": "Спавны (commandCenter) + Triggers", "export_res": "Ресурсы (res_pool)", "export_embed": "Тайлсеты встроены (embedded_png)", "mountains": "🏔 Горы", "rivers": "🌊 Реки", "mountain_shape": "🏔 Горный", "peninsula": "🌊 Полуостров", "players_lbl": "Игроков", "resources_sec": "РЕСУРСЫ", "res_few": "Мало", "res_mid": "Норма", "res_many": "Много", "more_lbl": "More", "custom_res": "Ресурсы (точно)", "custom_pl": "Игроки (точно)", "place_btn": "⚡ Расставить", "more8_lbl": "Более 8 игроков", "more8_hint": "Выбери команду вручную:", "more8_team": "= номер команды", "secret_btn": "Секрет", "load_tmx": "📂 Загрузить .tmx", "lang": "EN"}, "en": {"title": "RUSTED WARFARE", "subtitle": "Map Generator", "generate": "⟳ Generate", "export": "💾 Export TMX", "auto": "🎲 Auto", "view": "View", "spawn": "Spawn", "resource": "Resource", "erase": "Erase", "settings": "Settings", "generation": "Generation", "size": "Size", "noise": "Noise", "octaves": "Octaves", "water": "Water", "biome": "Biome", "temperate": "🌿 Temperate", "desert": "🏜 Desert", "arctic": "❄ Arctic", "volcanic": "🌋 Volcanic", "continents": "🏝 Islands", "archipelago": "⛰ Mountain", "flat": "🌊 Coastal", "seed": "Seed", "seed_ph": "Seed (auto)", "shape": "Map shape", "island": "Island", "mainland": "Mainland", "lakes": "Lakes", "maze": "Maze", "symmetry": "Symmetry", "sym_none": "None", "sym_h": "↔ Horizontal", "sym_v": "↕ Vertical", "sym_4": "✦ 4-way", "players": "Players", "team_spawn": "Spawn team", "stats": "Markers", "spawns": "Spawns", "resources": "Resources", "export_lbl": "Export", "export_note": "Single .tmx file. Copy to", "export_note2": "/sdcard/Rusted Warfare/maps/", "download_tmx": "↓ Download .tmx", "save_png": "🖼 PNG", "clear": "✕ Clear markers", "auto_title": "🎲 Auto placement", "auto_note": "Auto-places spawns and resources for the selected mode.", "1v1": "⚔ 1 vs 1", "2v2": "🤝 2 vs 2", "ffa3": "🔥 FFA 3", "ffa4": "💥 FFA 4", "1v4": "🎯 1 vs 4", "no_map": "No map", "no_water": "Can't place on water!", "need_map": "Generate a map first!", "terrain": {"deep": "🌊 Deep water", "shore": "〰 Shore", "beach": "🏖 Beach", "plain": "🌿 Plain", "grass": "🌱 Grass", "forest": "🌲 Forest", "rock": "⛰ Rock", "mountain": "🏔 Mountain", "snow": "❄ Peaks"}, "export_spawns": "Spawns (commandCenter) + Triggers", "export_res": "Resources (res_pool)", "export_embed": "Tilesets embedded (embedded_png)", "mountains": "🏔 Mountains", "rivers": "🌊 Rivers", "mountain_shape": "🏔 Mountainous", "peninsula": "🌊 Peninsula", "players_lbl": "Players", "resources_sec": "RESOURCES", "res_few": "Few", "res_mid": "Normal", "res_many": "Many", "more_lbl": "More", "custom_res": "Resources (exact)", "custom_pl": "Players (exact)", "place_btn": "⚡ Place", "more8_lbl": "More than 8 players", "more8_hint": "Enter team number manually:", "more8_team": "= team number", "secret_btn": "Secret", "load_tmx": "📂 Load .tmx map", "lang": "RU"}};
let lang = 'en';

function t(key){ return LANG_DATA[lang][key] || key; }
function applyLang(){
  // Update all data-i elements
  document.querySelectorAll('[data-i]').forEach(el=>{
    const k=el.dataset.i;
    const v=t(k);
    if(v) el.textContent=v;
  });
  // Placeholder updates
  const sd=document.getElementById('iSd');
  sd.placeholder=lang==='ru'?sd.dataset.phRu:sd.dataset.phEn;
  // Lang button shows opposite
  document.getElementById('langBtn').textContent=lang==='ru'?'EN':'RU';
  // Select options
  document.querySelectorAll('select option[data-i]').forEach(o=>{
    const v=t(o.dataset.i);
    if(v) o.textContent=v;
  });
  // Tool labels
  const actMap={view:t('view'),spawn:t('spawn')+' P'+curTeam,crystal:t('resource'),erase:t('erase')};
  document.getElementById('hact').textContent=actMap[tool]||tool;
  // Biome label in brand
  const map_label = hmap ? W+'×'+H+' · '+gv('sBm')+' · #'+seed : t('subtitle');
  document.getElementById('t-maplabel').textContent=map_label;
}

function toggleLang(){
  lang = lang==='en'?'ru':'en';
  applyLang();
}

/* ══════ GID CONSTANTS ══════
  terrain: firstgid=1, 32 tiles
  misc:    firstgid=33, 9 tiles (single row)
    tile 0 = res_pool (single tile marker — extractor buildable here)
  units:   firstgid=42, 8 tiles
    tile 0 = P1 CC (team 1)
    tile 1 = P2 CC (team 2) ... tile 7 = P8 CC
══════════════════════════════ */
const GID_T  = 1;
const GID_M  = 33;  // 1+32
const GID_U  = 42;  // 33+9
const G_RES  = GID_M + 4;          // GID 37 = res_pool center (3x3 block placed around it)
const spGID  = t => GID_U + t;     // team0=42,team1=43...team7=49

const SIZES = [32, 64, 128, 200, 256, 400, 512, 700, 800, 1024, 1300];
const TILE  = 20;
const TC = ['#ffc24a','#ff5e5e','#60a5fa','#4ade80','#c084fc','#f472b6','#fb923c','#22d3ee',
            '#facc15','#f87171','#a78bfa','#34d399','#e879f9','#fb7185','#fdba74','#67e8f9',
            '#fde68a','#fca5a5','#c4b5fd','#6ee7b7','#f0abfc','#fda4af','#fed7aa','#a5f3fc',
            '#fef08a','#fecaca','#ddd6fe','#bbf7d0','#f5d0fe','#fecdd3','#ffedd5','#cffafe'];
// Generate a stable color for any team index (wraps or generates)
function teamColor(t){ return TC[((t%32)+32)%32] || ('#'+((t*2654435761)>>>0).toString(16).padStart(6,'0').slice(0,6)); }
const VC = {
  temperate:[[28,52,82],[33,65,98],[130,105,74],[70,112,50],[55,92,42],[32,62,30],[82,78,73],[92,86,78],[210,218,226]],
  desert:   [[18,56,90],[22,66,100],[185,152,86],[145,124,68],[110,98,50],[86,78,45],[102,83,64],[114,96,80],[224,214,196]],
  arctic:   [[8,20,52],[11,28,63],[152,172,190],[142,165,184],[76,106,126],[50,80,106],[88,92,103],[100,105,118],[232,242,252]],
  volcanic: [[96,10,4],[115,18,8],[68,50,46],[46,36,31],[36,28,26],[28,22,20],[43,36,35],[50,40,40],[155,138,128]],
};

/* ══════ STATE ══════ */
let W=64,H=64,hmap=null,markers=[],tool='view';
let vS=3,vX=0,vY=0,seed=0,curTeam=0;

const mc=document.getElementById('mc'),ctx=mc.getContext('2d');
const ov=document.getElementById('ov'),ovx=ov.getContext('2d');
const mc2=document.getElementById('mc2'),ctx2=mc2.getContext('2d');
const ma=document.getElementById('ma');

/* ══════ UI HELPERS ══════ */
const $=id=>document.getElementById(id);
const gv=id=>$(id).value;
const sl=(el,id,fn)=>$(id).textContent=fn(el.value);

// Team buttons
const tg=$('tgrid');
for(let i=0;i<8;i++){
  const b=document.createElement('button');
  b.className='tbtn'+(i===0?' on':'');
  b.style.cssText=`border-color:${TC[i]};color:${TC[i]}`;
  b.textContent='P'+(i+1);
  b.onclick=()=>{curTeam=i;document.querySelectorAll('.tbtn').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    $('hact').textContent=t('spawn')+' P'+(i+1);};
  tg.appendChild(b);
}

function rndS(){seed=Math.floor(Math.random()*1e9);$('iSd').value=seed;}
rndS();

let tt;
function toast(msg,type='ok',ms=2500){
  const el=$('toast');$('tmsg').textContent=msg;
  el.className='on'+(type==='err'?' err':type==='warn'?' warn':'');
  clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),ms);
}
function setPg(p,l){
  const w=$('pg');
  if(p>=100){w.classList.remove('on');return;}
  w.classList.add('on');$('pgf').style.width=p+'%';
  if(l) $('pgl').textContent=l;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function openDr(){$('dr').classList.add('on');$('bd').classList.add('on');}
function closeDr(){$('dr').classList.remove('on');$('bd').classList.remove('on');}
function openExp(){
  if(!hmap){toast(t('need_map'),'err');return;}
  $('expFn').textContent=`[p${'4'}]gen_${seed}_${W}x${H}.tmx`;
  $('expSh').classList.add('on');
}
function closeExp(){$('expSh').classList.remove('on');}
function openAuto(){$('autoSh').classList.add('on');}
function closeAuto(){$('autoSh').classList.remove('on');}

/* ══════ GENERATE ══════ */
async function gen(){
  const si=$('iSd').value.trim();
  if(si) seed=isNaN(+si)?hs(si):(+si|0);
  else{seed=Math.floor(Math.random()*1e9);$('iSd').value=seed;}
  _autoShuffleSeed = 0; // reset so Place gives fresh layout on new map
  W=H=SIZES[+gv('rSz')];
  const sc=gv('rSc')/10,oc=+gv('rOc'),wl=gv('rWt')/100;
  const bm=gv('sBm'),sh=gv('sShape');
  const mt=+gv('rMt')/100;
  setPg(5,'Perlin…');await sleep(30);
  const pn=new Perlin(seed);
  hmap=new Float32Array(W*H);
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    hmap[y*W+x]=noiseShape(pn,x,y,W,H,sc,oc,sh,mt);
  }
  // Rivers: start at coast and carve inland
  carveRivers(pn,wl);
  setPg(55,'Render…');await sleep(16);
  drawT(bm,wl);
  setPg(88,'…');await sleep(16);
  redrawOv();updS();updMini();resetV();
  setPg(100);
  applyLang();
  toast(`✓ ${W}×${H} · ${bm} · #${seed}`);
}

function noiseShape(pn,x,y,W,H,sc,oc,sh,mt){
  const nx=x/W*sc, ny=y/H*sc;
  const cx=(x/W)*2-1, cy=(y/H)*2-1;
  const mb=mt===undefined?.5:mt;

  // ── Domain warp (два слоя) ──────────────────────────────────────────
  // Первый варп — крупные изгибы
  const wx1=pn.fbm(nx*.9+3.7,  ny*.9-2.1,  3)*.7;
  const wy1=pn.fbm(nx*.9-1.9,  ny*.9+4.3,  3)*.7;
  // Второй варп поверх первого — мелкая органика береговой линии
  const wx2=pn.fbm(nx*2.3+wx1+11, ny*2.3+wy1-7, 3)*.25;
  const wy2=pn.fbm(nx*2.3+wx1-5,  ny*2.3+wy1+9, 3)*.25;
  const wnx=nx+wx1+wx2, wny=ny+wy1+wy2;

  // ── Базовый рельеф ──────────────────────────────────────────────────
  const base=pn.fbm(wnx,wny,oc)*.5+.5;

  // ── Горы (ridge noise) ──────────────────────────────────────────────
  const r1=1-Math.abs(pn.fbm(wnx*2.1+7.3, wny*2.1-5.1, 4)*2-1);
  const r2=1-Math.abs(pn.fbm(wnx*4.3-3.5, wny*4.3+6.7, 3)*2-1);
  const plateau=Math.pow(pn.fbm(wnx*1.8+11,wny*1.8-8,3)*.5+.5, 2.2);
  const mLayer=(r1*.55+r2*.25+plateau*.2)*mb*.72;

  // ── Граница карты: только самые края, НЕ круговая ───────────────────
  // Плавное затухание в последних 8% у каждого края
  const bx=Math.max(0,(Math.abs(cx)-.84)/.16);
  const by=Math.max(0,(Math.abs(cy)-.84)/.16);
  const ef=1-Math.pow(Math.max(bx,by),1.5);

  // ── Континентальная маска ───────────────────────────────────────────
  // Ключевая идея: ОДИН многооктавный FBM с сильным domain warp
  // задаёт форму континента. Нет ни dist от центра, ни прямоугольных блоков.
  // Смещения (ox,oy) уникальны для каждого типа карты → разные формы.
  function continentMask(ox, oy, freq, thresh, sharpness){
    // Крупный варп для случайного положения суши на карте
    const cwx=pn.fbm(nx*freq*.7+ox,     ny*freq*.7+oy,     3)*.9;
    const cwy=pn.fbm(nx*freq*.7+ox+7.3, ny*freq*.7+oy-4.1, 3)*.9;
    // Финальный шум через двойной варп → мягкие органичные берега
    const c=pn.fbm(nx*freq+cwx+ox*.4, ny*freq+cwy+oy*.4, 5)*.5+.5;
    // Сигмоид для чёткого, но не блочного края
    return Math.max(0, Math.min(1, (c-thresh)*sharpness+.5));
  }

  if(sh==='island'){
    // Один-два крупных острова, произвольное положение
    const m=continentMask(2.1,-1.3, 1.1, 0.50, 6) * ef;
    return (base*.65+mLayer*.35)*m;
  }
  if(sh==='mainland'){
    // Большой континент, занимает 50-70% карты, обрезан краями
    const m=continentMask(5.2, 3.1, 0.75, 0.44, 5) * ef;
    return (base*.75+m*.12)*m + mLayer*Math.min(1,m*1.6);
  }
  if(sh==='lakes'){
    // Почти весь материк с озёрами — низкий порог, много суши
    const m=continentMask(1.5, 7.2, 0.7, 0.38, 5) * ef;
    const ln=1-Math.pow(pn.fbm(wnx*2.8+3,wny*2.8-2,4)*.5+.5, 1.4);
    return (base*.6+ln*.25+m*.15)*m + mLayer*Math.min(1,m*1.4);
  }
  if(sh==='archipelago'){
    // Много небольших островов — высокий порог + высокая частота
    const m=continentMask(3.3,-2.1, 1.6, 0.54, 8) * ef;
    const peaks=1-Math.abs(pn.fbm(wnx*1.1,wny*1.1,5));
    return (base*.4+peaks*.6)*m + mLayer*m*.5;
  }
  if(sh==='mountain'){
    const r3=1-Math.abs(pn.fbm(wnx*6.1+1.3,wny*6.1-3.8,3)*2-1);
    const mEx=(r1*.4+r2*.35+r3*.25)*mb*.85;
    const m=continentMask(-1.7,4.4, 1.0, 0.48, 6) * ef;
    return base*m + mEx*m;
  }
  if(sh==='peninsula'){
    // Суша «вытекает» с одной стороны: накладываем асимметричный градиент
    const tilt=pn.fbm(nx*.5+8, ny*.5+2, 2)*.4+.3; // случайный наклон
    const bias=cx*tilt + cy*(0.3-tilt); // диагональный уклон
    const m=continentMask(6.1,-3.2, 0.9, 0.44+bias*.18, 5) * ef;
    return (base*.7+mLayer*.3)*m;
  }
  // maze / default
  const m=continentMask(1.1,-2.2, 1.05, 0.48, 6) * ef;
  return (base*.7+mLayer*.3)*m;
}

/* ══════ RIVER CARVING ══════ */
function carveRivers(pn,wl){
  // WorldBox-style rivers: thin (1-3px), winding, pure noise-driven curl noise paths
  // No height logic — just organic curl noise that naturally meanders across land
  const numRivers = Math.max(2, Math.floor(Math.min(W,H)/40));
  const rng=(s)=>{let r=s;return()=>{r=(r*1664525+1013904223)&0xffffffff;return(r>>>0)/0xffffffff;};};
  const rand = rng(seed ^ 0xc0ffee);
  const mg = Math.max(4, Math.floor(Math.min(W,H)*.04));

  // Collect shore start points (land touching water)
  const shorePts = [];
  for(let y=mg; y<H-mg; y++) for(let x=mg; x<W-mg; x++){
    const h = hmap[y*W+x];
    if(h <= wl || h > wl+.15) continue;
    let nearWater = false;
    for(const[dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      if(hmap[(y+dy)*W+(x+dx)] <= wl){ nearWater=true; break; }
    }
    if(nearWater) shorePts.push([x,y]);
  }
  if(!shorePts.length) return;

  // Shuffle and spread start points
  for(let i=shorePts.length-1;i>0;i--){
    const j=Math.floor(rand()*(i+1));
    [shorePts[i],shorePts[j]]=[shorePts[j],shorePts[i]];
  }
  const minSep = Math.max(W,H) * .20;
  const starts = [];
  for(const pt of shorePts){
    if(starts.length >= numRivers) break;
    if(!starts.some(s=>Math.hypot(pt[0]-s[0],pt[1]-s[1]) < minSep)) starts.push(pt);
  }
  if(!starts.length) return;

  // Precompute a river paint buffer to avoid double-carving artifacts
  const riverMap = new Uint8Array(W*H);

  for(const [sx,sy] of starts){
    // Use continuous floating-point position + angle-based movement (like a worm)
    let px = sx + 0.5, py = sy + 0.5;
    // Initial angle: point roughly away from nearest water (inward)
    // Estimate inland direction via gradient
    let ax=0,ay=0;
    for(const[dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx2=Math.round(px)+dx, ny2=Math.round(py)+dy;
      if(nx2<0||nx2>=W||ny2<0||ny2>=H) continue;
      const dh = hmap[ny2*W+nx2] - hmap[Math.round(py)*W+Math.round(px)];
      ax+=dx*dh; ay+=dy*dh;
    }
    let angle = Math.atan2(ay,ax) + (rand()-0.5)*0.5;

    const maxLen = Math.max(W,H) * 3.5;
    const stepSize = 0.8; // sub-pixel steps for smooth curve
    const path = [];

    for(let s=0; s<maxLen; s++){
      const ix=Math.round(px), iy=Math.round(py);
      if(ix<1||ix>=W-1||iy<1||iy>=H-1) break;

      // Stop if we've gone back to sea (river reached a lake/sea inland)
      const hv = hmap[iy*W+ix];
      if(hv <= wl-0.01 && s > 5) break;
      // Stop if climbed too high
      if(hv > wl+0.62) break;

      path.push([px,py]);

      // Curl noise: sample two offset noise values to get perpendicular curl
      // This is the key to WorldBox-style organic rivers
      const nx_ = px/W * 6;
      const ny_ = py/H * 6;
      const eps = 0.1;
      // Curl of a noise field F: curlX = dF/dy, curlY = -dF/dx
      const F00 = pn.fbm(nx_,      ny_,      4);
      const F01 = pn.fbm(nx_,      ny_+eps,  4);
      const F10 = pn.fbm(nx_+eps,  ny_,      4);
      const curlX = (F01 - F00) / eps;
      const curlY = -(F10 - F00) / eps;

      // Blend current direction with curl field for smooth turns
      const curlAngle = Math.atan2(curlY, curlX);
      // Angle difference (wrap)
      let diff = curlAngle - angle;
      while(diff >  Math.PI) diff -= Math.PI*2;
      while(diff < -Math.PI) diff += Math.PI*2;
      // Max turn per step: keeps river from doubling back sharply
      const maxTurn = 0.08;
      angle += Math.max(-maxTurn, Math.min(maxTurn, diff * 0.35));

      px += Math.cos(angle) * stepSize;
      py += Math.sin(angle) * stepSize;
    }

    if(path.length < 8) continue;

    // Smooth path positions (moving average)
    const sm = [];
    const sw = 4;
    for(let i=0;i<path.length;i++){
      let sx2=0,sy2=0,cnt=0;
      for(let j=Math.max(0,i-sw);j<=Math.min(path.length-1,i+sw);j++){
        sx2+=path[j][0]; sy2+=path[j][1]; cnt++;
      }
      sm.push([sx2/cnt, sy2/cnt]);
    }

    // Paint: 1-2 px wide, thin and precise
    const baseW = Math.max(1.2, Math.min(W,H)/140);
    for(let i=0;i<sm.length;i++){
      const [cx,cy] = sm[i];
      const t = i / sm.length;
      // Taper: slightly wider at mouth, thin at tip
      const w = baseW * (1 - t*0.45);
      const wr = Math.ceil(w + 1);

      for(let dy=-wr;dy<=wr;dy++) for(let dx=-wr;dx<=wr;dx++){
        const qx=Math.round(cx+dx), qy=Math.round(cy+dy);
        if(qx<1||qx>=W-1||qy<1||qy>=H-1) continue;
        const dist = Math.hypot(cx-qx, cy-qy);
        if(dist > w + 0.5) continue;
        const ni = qy*W+qx;
        // Only carve land, not already-deep water
        if(hmap[ni] < wl-0.04) continue;
        // Smooth falloff — soft edges, no hard pixel blocks
        const falloff = Math.pow(Math.max(0, 1-(dist/w)), 1.8);
        const carved = wl - 0.015;
        hmap[ni] = hmap[ni] - (hmap[ni]-carved)*falloff;
      }
    }
  }
}
function hs(s){let h=0;for(let i=0;i<s.length;i++) h=Math.imul(31,h)+s.charCodeAt(i)|0;return h>>>0;}

/* ══════ DRAW TERRAIN ══════ */
function lC(a,b,t){t=Math.max(0,Math.min(1,t));return a.map((v,i)=>v+(b[i]-v)*t);}
function vCol(h,bm,wl){
  const c=VC[bm];
  if(h<wl-.07) return c[0];
  if(h<wl)     return lC(c[0],c[1],(h-wl+.07)/.07);
  if(h<wl+.04) return c[2];
  if(h<wl+.18) return c[3];
  if(h<wl+.26) return lC(c[3],c[4],(h-wl-.18)/.08);
  if(h<wl+.38) return lC(c[4],c[5],(h-wl-.26)/.12);
  if(h<wl+.50) return lC(c[5],c[6],(h-wl-.38)/.12);
  if(h<wl+.54) return c[7];
  return lC(c[7],c[8],(h-wl-.54)/.46);
}

function drawT(bm,wl){
  mc.width=W;mc.height=H;ov.width=W;ov.height=H;
  const img=ctx.createImageData(W,H);const d=img.data;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const [r,g,b]=vCol(hmap[y*W+x],bm,wl).map(Math.round);
    const i=(y*W+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
  }
  ctx.putImageData(img,0,0);
  // Hillshade
  const i2=ctx.getImageData(0,0,W,H);const d2=i2.data;
  for(let y=1;y<H;y++) for(let x=1;x<W;x++){
    const hv=hmap[y*W+x];if(hv<wl) continue;
    const sh=((hv-hmap[y*W+x-1])+(hv-hmap[(y-1)*W+x]))*200;
    const cl=Math.max(-16,Math.min(16,sh));
    const i=(y*W+x)*4;
    d2[i]=Math.min(255,Math.max(0,d2[i]-cl));
    d2[i+1]=Math.min(255,Math.max(0,d2[i+1]-cl));
    d2[i+2]=Math.min(255,Math.max(0,d2[i+2]-cl));
  }
  ctx.putImageData(i2,0,0);
}


/* ══════ VIEW ══════ */
function resetV(){
  if(!hmap) return;
  vS=Math.max(1,Math.min(6,Math.floor(Math.min(ma.clientWidth/W,ma.clientHeight/H))));
  vX=Math.round((ma.clientWidth-W*vS)/2);vY=Math.round((ma.clientHeight-H*vS)/2);
  applyT();
}
function applyT(){
  const pw=W*vS,ph=H*vS;
  for(const el of [mc,ov]){el.style.cssText=`position:absolute;width:${pw}px;height:${ph}px;left:${vX}px;top:${vY}px`;}
}
function doZ(f,cx,cy){
  cx=cx??ma.clientWidth/2;cy=cy??ma.clientHeight/2;
  vX=cx-(cx-vX)*f;vY=cy-(cy-vY)*f;
  vS=Math.max(.5,Math.min(24,vS*f));applyT();
}

/* ══════ TOOLS ══════ */
function setT(t_){
  tool=t_;
  document.querySelectorAll('.tl').forEach(b=>b.classList.remove('on'));
  $('t-'+t_)?.classList.add('on');
  const icons={view:'👁',spawn:'🏠 P'+(curTeam+1),crystal:'🟢',erase:'✕'};
  $('hact').textContent=icons[t_]||t_;
  $('tsec').style.display=(t_==='spawn'?'block':'none');
}
function mXY(cx,cy){
  const r=ma.getBoundingClientRect();
  return[Math.floor((cx-r.left-vX)/vS),Math.floor((cy-r.top-vY)/vS)];
}

/* ══════ TOUCH ══════ */
let tSX=0,tSY=0,tMv=false,pinch=false,pD=0,tLX=0,tLY=0;
ma.addEventListener('touchstart',e=>{
  e.preventDefault();tMv=false;pinch=e.touches.length>=2;
  if(e.touches.length===2) pD=Math.hypot(e.touches[1].clientX-e.touches[0].clientX,e.touches[1].clientY-e.touches[0].clientY);
  if(e.touches.length===1){tSX=tLX=e.touches[0].clientX;tSY=tLY=e.touches[0].clientY;}
},{passive:false});
ma.addEventListener('touchmove',e=>{
  e.preventDefault();
  if(e.touches.length===2){
    pinch=true;
    const d=Math.hypot(e.touches[1].clientX-e.touches[0].clientX,e.touches[1].clientY-e.touches[0].clientY);
    const mx=(e.touches[0].clientX+e.touches[1].clientX)/2,my=(e.touches[0].clientY+e.touches[1].clientY)/2;
    if(pD>0) doZ(d/pD,mx,my);pD=d;
  }else if(!pinch&&e.touches.length===1){
    const tt_=e.touches[0];
    if(Math.hypot(tt_.clientX-tSX,tt_.clientY-tSY)>9) tMv=true;
    vX+=tt_.clientX-tLX;vY+=tt_.clientY-tLY;applyT();
    tLX=tt_.clientX;tLY=tt_.clientY;
    if(hmap){const[x,y]=mXY(tLX,tLY);$('hxy').textContent=x+':'+y;}
  }
},{passive:false});
ma.addEventListener('touchend',e=>{
  e.preventDefault();pD=0;
  if(!tMv&&!pinch&&e.changedTouches.length===1&&tool!=='view')
    placeM(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
  if(e.touches.length===0) pinch=false;
},{passive:false});

let mDr=false,mSX=0,mSY=0;
ma.addEventListener('mousedown',e=>{if(tool==='view'){mDr=true;mSX=e.clientX;mSY=e.clientY;}else placeM(e.clientX,e.clientY);});
ma.addEventListener('mousemove',e=>{
  if(mDr){vX+=e.clientX-mSX;vY+=e.clientY-mSY;mSX=e.clientX;mSY=e.clientY;applyT();}
  if(hmap){const[x,y]=mXY(e.clientX,e.clientY);$('hxy').textContent=x+':'+y;updHUD(x,y);}
});
ma.addEventListener('mouseup',()=>mDr=false);
ma.addEventListener('wheel',e=>{e.preventDefault();doZ(e.deltaY<0?1.1:.91);},{passive:false});

function updHUD(mx,my){
  if(mx>=0&&mx<W&&my>=0&&my<H){
    const wl=gv('rWt')/100;const hv=hmap[my*W+mx];
    const tr=t('terrain');
    const n=hv<wl-.06?tr.deep:hv<wl?tr.shore:hv<wl+.04?tr.beach:
            hv<wl+.26?tr.plain:hv<wl+.38?tr.grass:hv<wl+.50?tr.forest:
            hv<wl+.54?tr.rock:hv<wl+.70?tr.mountain:tr.snow;
    $('hter').textContent=n;
  }
}

let _more8=false;
function toggleMore8(on){
  _more8=on;
  document.getElementById('more8block').style.display=on?'block':'none';
  if(!on){
    // сброс на стандартный диапазон
    curTeam=Math.min(curTeam,7);
    document.querySelectorAll('.tbtn').forEach((b,i)=>{b.classList.toggle('on',i===curTeam);});
  }
}
function placeM(cx,cy){
  if(!hmap) return;
  const[mx,my]=mXY(cx,cy);
  if(mx<0||mx>=W||my<0||my>=H) return;
  const wl=gv('rWt')/100;
  if(tool==='erase'){
    markers=markers.filter(m=>Math.abs(m.x-mx)>2||Math.abs(m.y-my)>2);
    redrawOv();updS();return;
  }
  if(hmap[my*W+mx]<wl){toast(t('no_water'),'err');return;}
  // Определяем номер команды
  let teamNum=curTeam;
  if(tool==='spawn'&&_more8){
    teamNum=Math.max(0,Math.min(31,+document.getElementById('iMore8Team').value||0));
  }
  for(const[px,py] of symP(mx,my)){
    markers=markers.filter(m=>Math.abs(m.x-px)>2||Math.abs(m.y-py)>2);
    markers.push({type:tool,x:px,y:py,team:tool==='spawn'?teamNum:-1});
  }
  if(tool==='spawn'){
    if(_more8){
      // Инкремент поля
      const inp=document.getElementById('iMore8Team');
      inp.value=Math.min(31,(+inp.value||0)+1);
      $('hact').textContent=t('spawn')+' P'+(teamNum+1);
    } else {
      curTeam=(curTeam+1)%8;
      document.querySelectorAll('.tbtn').forEach((b,i)=>{b.classList.toggle('on',i===curTeam);});
      $('hact').textContent=t('spawn')+' P'+(curTeam+1);
    }
  }
  redrawOv();updS();updMini();
  if(navigator.vibrate) navigator.vibrate(14);
}
function symP(x,y){return[[x,y]];}

/* ══════ OVERLAY ══════ */
function redrawOv(){
  if(!hmap) return;
  ovx.clearRect(0,0,W,H);
  for(const m of markers){
    if(m.type==='crystal'){
      // Draw as original game: big round green pool
      // The extractor gets placed ON this tile in-game
      const x=m.x+.5,y=m.y+.5;
      ovx.save();
      ovx.globalAlpha=.9;
      // Outer dark ring (matches original game visual)
      ovx.beginPath();ovx.arc(x,y,6.5,0,Math.PI*2);
      ovx.fillStyle='rgba(5,50,10,.6)';ovx.fill();
      ovx.strokeStyle='rgba(30,180,40,.6)';ovx.lineWidth=.5;ovx.stroke();
      // Main green fill
      ovx.beginPath();ovx.arc(x,y,5,0,Math.PI*2);
      ovx.fillStyle='#15803d';ovx.fill();
      // Bright center
      ovx.beginPath();ovx.arc(x,y,3,0,Math.PI*2);
      ovx.fillStyle='#22c55e';ovx.fill();
      // Highlight top-left
      ovx.beginPath();ovx.arc(x-.8,y-1,1.4,0,Math.PI*2);
      ovx.fillStyle='rgba(180,255,160,.5)';ovx.fill();
      ovx.restore();
    }else if(m.type==='spawn'){
      const col=teamColor(m.team>=0?m.team:0);
      const x=m.x+.5,y=m.y+.5;
      ovx.save();
      ovx.globalAlpha=.9;
      ovx.beginPath();ovx.arc(x,y,6,0,Math.PI*2);
      ovx.fillStyle=col+'20';ovx.fill();
      ovx.beginPath();ovx.arc(x,y,4.5,0,Math.PI*2);
      ovx.strokeStyle=col;ovx.lineWidth=.8;ovx.stroke();
      ovx.beginPath();ovx.arc(x,y,2,0,Math.PI*2);
      ovx.fillStyle=col;ovx.fill();
      ovx.restore();
    }
  }
}
async function doSecret(){
  closeAuto();
  setPg(5, lang==='ru'?'🔒 Секретная карта…':'🔒 Secret map…');
  await sleep(30);

  // Текущие настройки UI — биом, форма, октавы, шум
  const sc=gv('rSc')/10, oc=+gv('rOc');
  const bm=gv('sBm'), sh=gv('sShape'), mt=+gv('rMt')/100;

  // Случайный сид, уровень воды и горы — игрок не знает что получится
  const sSeed = Math.floor(Math.random()*1e9);
  const wl = 0.10 + Math.random()*0.38;       // 0.10..0.48 (полный диапазон слайдера)
  const secretMt = 0.2 + Math.random()*0.6;       // 0.2..0.8

  // Размер — тот же что на экране
  const secretW = W||256, secretH = H||256;

  // Генерация рельефа
  const pn = new Perlin(sSeed);
  const secretHmap = new Float32Array(secretW*secretH);
  for(let y=0;y<secretH;y++) for(let x=0;x<secretW;x++)
    secretHmap[y*secretW+x] = noiseShape(pn,x,y,secretW,secretH,sc,oc,sh,secretMt);

  setPg(35, lang==='ru'?'Расстановка…':'Placing…');
  await sleep(16);

  // Кол-во игроков из текущего значения Auto-sheet
  const n = _plCustom||+document.getElementById('rAP').value||4;
  // Ресурсы — случайный выбор среди мало/норма/много
  const resCounts = [5,10,15];
  const targetRes = resCounts[Math.floor(Math.random()*3)];

  const mg = Math.max(3, Math.floor(Math.min(secretW,secretH)*.04));
  const safeR = 4;

  // Отдельный рандом для shuffle — не тратится на сканирование
  const rng=(s)=>{let r=s;return()=>{r=(r*1664525+1013904223)&0xffffffff;return(r>>>0)/0xffffffff;};};
  const randShuffle = rng(sSeed ^ 0x1234beef);
  const shuffle = a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(randShuffle()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  // Вода lookup
  const isWater = new Uint8Array(secretW*secretH);
  for(let i=0;i<secretW*secretH;i++) if(secretHmap[i]<=wl) isWater[i]=1;

  // Карта дистанции до воды (BFS-lite: просто считаем минимальный квадрат без воды)
  // Используем prefixsum для быстрой проверки прямоугольника
  const prefW = new Uint32Array((secretW+1)*(secretH+1));
  for(let y=0;y<secretH;y++) for(let x=0;x<secretW;x++){
    prefW[(y+1)*(secretW+1)+(x+1)] =
      (isWater[y*secretW+x]?1:0)
      + prefW[y*(secretW+1)+(x+1)]
      + prefW[(y+1)*(secretW+1)+x]
      - prefW[y*(secretW+1)+x];
  }
  // Проверяет, есть ли вода в квадрате [x-r..x+r, y-r..y+r]
  function hasWaterNear(x,y,r){
    const x0=Math.max(0,x-r), y0=Math.max(0,y-r);
    const x1=Math.min(secretW-1,x+r), y1=Math.min(secretH-1,y+r);
    const sum = prefW[(y1+1)*(secretW+1)+(x1+1)]
              - prefW[y0*(secretW+1)+(x1+1)]
              - prefW[(y1+1)*(secretW+1)+x0]
              + prefW[y0*(secretW+1)+x0];
    return sum > 0;
  }

  // Сбор пригодных тайлов
  const spawnLand=[], resLand=[];
  const chunkH = Math.ceil(secretH/8);
  for(let cy0=mg;cy0<secretH-mg;cy0+=chunkH){
    const cy1=Math.min(cy0+chunkH,secretH-mg);
    for(let y=cy0;y<cy1;y++) for(let x=mg;x<secretW-mg;x++){
      const hv=secretHmap[y*secretW+x];
      // Ресурсы — вся суша до скал
      if(hv>wl&&hv<wl+.50) resLand.push([x,y]);
      // Спавны — суша не слишком высокая, без воды в радиусе safeR
      if(hv<=wl) continue;           // сама вода
      if(hv>wl+.52) continue;        // скалы/горы
      if(hasWaterNear(x,y,safeR)) continue;
      spawnLand.push([x,y]);
    }
    await sleep(0);
  }
  if(spawnLand.length<2){
    setPg(100);
    toast(lang==='ru'?'Мало суши для спавнов':'Not enough land for spawns','warn');
    return;
  }

  // Спавны — fallback всегда из spawnLand (никогда не из воды)
  const minSpDist=Math.max(secretW,secretH)*.18;
  const spPts=[];
  const sLandShuffled=shuffle([...spawnLand]);
  for(let i=0;i<n;i++){
    let b=null;
    // Попытка 1: полное расстояние
    for(const[lx,ly] of sLandShuffled){
      if(!spPts.some(p=>Math.hypot(lx-p[0],ly-p[1])<minSpDist)){b=[lx,ly];break;}
    }
    // Попытка 2: половинное расстояние
    if(!b){
      const d2=minSpDist*.5;
      for(const[lx,ly] of sLandShuffled){
        if(!spPts.some(p=>Math.hypot(lx-p[0],ly-p[1])<d2)){b=[lx,ly];break;}
      }
    }
    // Попытка 3: минимальное расстояние (3 тайла — хотя бы не друг на друге)
    if(!b){
      for(const[lx,ly] of sLandShuffled){
        if(!spPts.some(p=>Math.hypot(lx-p[0],ly-p[1])<3)){b=[lx,ly];break;}
      }
    }
    // Последний fallback: просто следующий из списка (всегда суша)
    if(!b) b=sLandShuffled[i%sLandShuffled.length];
    spPts.push(b);
  }
  const sMarkers=spPts.map((pt,i)=>({type:'spawn',x:pt[0],y:pt[1],team:i}));

  // Ресурсы
  const placed=[];
  const minR=Math.max(6,Math.floor(Math.min(secretW,secretH)*.035));
  const Rr=Math.min(secretW,secretH)*.3;
  for(const[sx,sy] of shuffle([...spPts])){
    if(placed.length>=targetRes) break;
    const cands=resLand.filter(([x,y])=>{
      const d=Math.hypot(x-sx,y-sy);
      return d>8&&d<Rr*.7&&!placed.some(([px,py])=>Math.hypot(x-px,y-py)<minR);
    });
    shuffle(cands);
    if(cands.length){const[rx,ry]=cands[0];placed.push([rx,ry]);sMarkers.push({type:'crystal',x:rx,y:ry,team:-1});}
  }
  for(const[rx,ry] of shuffle([...resLand])){
    if(placed.length>=targetRes) break;
    if(placed.some(([px,py])=>Math.hypot(rx-px,ry-py)<minR)) continue;
    placed.push([rx,ry]);sMarkers.push({type:'crystal',x:rx,y:ry,team:-1});
  }

  setPg(70, lang==='ru'?'Экспорт…':'Exporting…');
  await sleep(16);

  const tmxStr=await buildTMXDirect(secretHmap,secretW,secretH,sSeed,bm,wl,sMarkers);

  setPg(95, lang==='ru'?'Скачивание…':'Downloading…');
  await sleep(16);

  const blob=new Blob([tmxStr],{type:'application/octet-stream'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='SecretMap.tmx'; a.click();
  URL.revokeObjectURL(url);

  setPg(100);
  toast(lang==='ru'?'🔒 SecretMap.tmx скачан':'🔒 SecretMap.tmx downloaded');
}

function updS(){
  $('stSp').textContent=markers.filter(m=>m.type==='spawn').length;
  $('stCr').textContent=markers.filter(m=>m.type==='crystal').length;
}
function updMini(){
  if(!hmap) return;
  mc2.width=W;mc2.height=H;
  ctx2.drawImage(mc,0,0,W,H,0,0,W,H);
  for(const m of markers){
    const col=m.type==='spawn'?teamColor(m.team>=0?m.team:0):'#4ade80';
    ctx2.fillStyle=col;ctx2.fillRect(m.x,m.y,2,2);
  }
}
function clearM(){markers=[];redrawOv();updS();updMini();toast(lang==='ru'?'Метки очищены':'Markers cleared');}

/* ══════ AUTO PLACE ══════ */
let _resMode='mid';
let _resCustom=null;
function setRes(m){
  _resCustom=null;
  document.getElementById('iResCustom').value='';
  _resMode=m;
  document.querySelectorAll('.rbtn').forEach(b=>b.classList.remove('on'));
  const el=document.getElementById('rb_'+m);
  if(el) el.classList.add('on');
}

let _plCustom=null;
function toggleMore(){
  const b=document.getElementById('moreBlock');
  const a=document.getElementById('moreArrow');
  const open=b.style.display==='none';
  b.style.display=open?'block':'none';
  a.style.transform=open?'rotate(90deg)':'';
}
function onCustomRes(v){
  _resCustom=v&&+v>0?+v:null;
  document.querySelectorAll('.rbtn').forEach(b=>b.classList.remove('on'));
  if(!_resCustom) setRes(_resMode);
}
function onCustomPl(v){
  _plCustom=v&&+v>=2?Math.min(32,+v):null;
}

let _autoShuffleSeed = 0;
function doAuto(){
  closeAuto();
  if(!hmap){toast(lang==='ru'?'Сначала сгенерируй карту!':'Generate map first!','err');return;}
  const wl=gv('rWt')/100;
  const n=_plCustom||+document.getElementById('rAP').value||4;

  // If markers already placed — use a new sub-seed so layout changes each press
  const hadMarkers = markers.length > 0;
  if(hadMarkers) _autoShuffleSeed = ((_autoShuffleSeed||seed) * 1664525 + 1013904223) & 0x7fffffff;
  else _autoShuffleSeed = seed ^ 0xabcdef;

  markers=[];

  const rng=(s)=>{let r=s;return()=>{r=(r*1664525+1013904223)&0xffffffff;return(r>>>0)/0xffffffff;};};
  const rand=rng(_autoShuffleSeed);
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*i);[a[i],a[j]]=[a[j],a[i]];}return a;};

  const mg=Math.max(3,Math.floor(Math.min(W,H)*.04));
  const land=[];
  for(let y=mg;y<H-mg;y++) for(let x=mg;x<W-mg;x++)
    if(hmap[y*W+x]>=wl+.05) land.push([x,y]);
  if(land.length<20){toast(lang==='ru'?'Мало суши!':'Not enough land!','warn');return;}

  const Rr=Math.min(W,H)*.3;
  const minDist=Math.max(W,H)*.2;
  const spPts=[];

  // Random spawn placement: shuffle land, pick spots with min distance
  shuffle(land);
  for(let ti=0;ti<n;ti++){
    let best=null;
    // First pass: full minDist
    for(const [lx,ly] of land){
      if(!spPts.some(([sx,sy])=>Math.hypot(lx-sx,ly-sy)<minDist)){best=[lx,ly];break;}
    }
    // Fallback: reduced distance
    if(!best){
      const minD2=minDist*.6;
      for(const [lx,ly] of land){
        if(!spPts.some(([sx,sy])=>Math.hypot(lx-sx,ly-sy)<minD2)){best=[lx,ly];break;}
      }
    }
    if(!best) best=land[ti*Math.floor(land.length/n)%land.length];
    spPts.push(best);
    markers.push({type:'spawn',x:best[0],y:best[1],team:ti});
  }

  // Количество ресурсов: своё число или выбор кнопками
  const targetRes=_resCustom||{few:5,mid:10,many:15}[_resMode]||10;
  const placed=[];
  const minR=8;

  // По одному рядом с каждым спавном
  for(const [sx,sy] of spPts){
    if(placed.length>=targetRes) break;
    const cands=land.filter(([x,y])=>{
      const d=Math.hypot(x-sx,y-sy);
      return d>8&&d<Rr*.7&&!placed.some(([px,py])=>Math.hypot(x-px,y-py)<minR)
             &&hmap[y*W+x]>=wl+.05;
    });
    if(cands.length){shuffle(cands);const[rx,ry]=cands[0];placed.push([rx,ry]);markers.push({type:'crystal',x:rx,y:ry,team:-1});}
  }
  // Остальные случайно
  let att=0;
  while(placed.length<targetRes&&att++<600){
    const[rx,ry]=land[Math.floor(rand()*land.length)];
    if(placed.some(([px,py])=>Math.hypot(rx-px,ry-py)<minR+2)) continue;
    if(hmap[ry*W+rx]<wl+.05) continue;
    placed.push([rx,ry]);markers.push({type:'crystal',x:rx,y:ry,team:-1});
  }

  redrawOv();updS();updMini();
  toast(lang==='ru'
    ? `✓ ${spPts.length} спавнов · ${placed.length} ресурсов`+(hadMarkers?' · 🔀 новый порядок':'')
    : `✓ ${spPts.length} spawns · ${placed.length} resources`+(hadMarkers?' · 🔀 reshuffled':''));
}

/* ══════ TMX BUILDER ══════
  SPAWN FIX: Added Triggers objectgroup with:
  - map_info: type=skirmish
  - team_N_info per team: team=N, credits=4000
  This is REQUIRED for player spawning to work!
  Player assigns to spawn point based on matching team number.
══════════════════════════ */
function terrIdx(h,wl){
  if(h<wl-.05) return 0; // deep water
  if(h<wl)     return 1; // shore
  if(h<wl+.04) return 2; // sand
  if(h<wl+.18) return 3; // light grass
  if(h<wl+.34) return 4; // grass
  if(h<wl+.50) return 5; // forest
  if(h<wl+.65) return 6; // rock
  if(h<wl+.76) return 7; // mountain
  return 8;               // snow
}

async function encB64(arr){
  // pako.deflate = zlib (RFC1950, 789c header) - correct for RW
  // u8b64 = pure JS base64, no btoa/fromCharCode - works on all Android WebView
  return u8b64(pako.deflate(new Uint8Array(arr.buffer),{level:6}));
}

// Строит TMX по явно переданным данным (для SecretMap — без изменения глобального состояния)
async function buildTMXDirect(hmapD, WD, HD, seedD, bmD, wlD, markersD){
  // передаём секретный wl явно
  const _hmap=hmap, _W=W, _H=H, _seed=seed, _markers=markers;
  hmap=hmapD; W=WD; H=HD; seed=seedD; markers=markersD;
  const result=await buildTMX(wlD);
  hmap=_hmap; W=_W; H=_H; seed=_seed; markers=_markers;
  return result;
}

async function buildTMX(wlOverride){
  const bm=gv('sBm'), wl=wlOverride!==undefined?wlOverride:gv('rWt')/100, pl=+'4';

  // Ground layer
  const gnd=new Uint32Array(W*H);
  for(let y=0;y<H;y++) for(let x=0;x<W;x++)
    gnd[y*W+x]=GID_T+terrIdx(hmap[y*W+x],wl);

  // Items layer — 3x3 res_pool block per resource point (matches bitmaps/misc.png layout)
  // Tiles 0-8 form the full round pool sprite: top-left to bottom-right
  const itm=new Uint32Array(W*H);
  for(const m of markers){
    if(m.type==='crystal'){
      for(let dy=-1;dy<=1;dy++){
        for(let dx=-1;dx<=1;dx++){
          const nx=m.x+dx, ny=m.y+dy;
          if(nx>=0&&nx<W&&ny>=0&&ny<H){
            const tid=(dy+1)*3+(dx+1); // 0..8
            itm[ny*W+nx]=GID_M+tid;
          }
        }
      }
    }
  }

  // Units layer — commandCenter tiles per team
  const unt=new Uint32Array(W*H);
  for(const m of markers){
    if(m.type==='spawn'&&m.x>=0&&m.x<W&&m.y>=0&&m.y<H)
      unt[m.y*W+m.x]=spGID(m.team>=0?m.team:0);
  }

  const[b64G,b64I,b64U]=await Promise.all([encB64(gnd),encB64(itm),encB64(unt)]);

  // Build units tileset tile properties
  let utiles='';
  for(let i=0;i<8;i++){
    utiles+='\n  <tile id="'+i+'"><properties>'+
      '<property name="unit" value="commandCenter"/>'+
      '<property name="team" value="'+i+'" type="int"/>'+
      '</properties></tile>';
  }

  // Misc tileset
  const mtiles='\n  <tile id="0"><properties><property name="res_pool" value=""/></properties></tile>';

  // Triggers — REQUIRED for player spawn assignment
  // map_info: tells game this is a skirmish map
  // team_N_info: assigns credits and team ID for each spawn point
  const uniqueTeams=[...new Set(markers.filter(m=>m.type==='spawn').map(m=>m.team>=0?m.team:0))].sort((a,b)=>a-b);
  let triggers='';
  let oid=100;
  // map_info trigger
  triggers+=`
  <object id="${oid++}" type="map_info" x="0" y="0" width="20" height="20">
   <properties><property name="levelsCount" value="${pl}" type="int"/></properties>
  </object>`;
  // team_N_info per unique team (0-indexed: team 0 = Player 1)
  for(const team of uniqueTeams){
    triggers+=`
  <object id="${oid++}" type="team_${team}_info" x="${(team+1)*20}" y="0" width="20" height="20">
   <properties>
    <property name="team" value="${team}" type="int"/>
    <property name="credits" value="4000" type="int"/>
   </properties>
  </object>`;
  }

  const mapName=`[p${pl}]gen_${seed}_${W}x${H}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.5" tiledversion="1.7.2"
     orientation="orthogonal" renderorder="right-down"
     width="${W}" height="${H}" tilewidth="20" tileheight="20"
     infinite="0" nextlayerid="6" nextobjectid="${oid+1}">
 <properties>
  <property name="description" value="${mapName}"/>
  <property name="playerCount" value="${pl}" type="int"/>
 </properties>

 <tileset firstgid="${GID_T}" name="${bm}"
          tilewidth="20" tileheight="20" tilecount="32" columns="32">
  <properties><property name="embedded_png" value="${TS['terrain_'+bm]}"/></properties>
  <image width="640" height="20" source="${bm}.png"/>
  <tile id="0"><properties><property name="water" value=""/></properties></tile>
  <tile id="1"><properties><property name="water" value=""/></properties></tile>
  <tile id="6"><properties><property name="cliff" value=""/></properties></tile>
  <tile id="7"><properties><property name="cliff" value=""/><property name="block-land" value=""/></properties></tile>
  <tile id="8"><properties><property name="cliff" value=""/><property name="block-land" value=""/></properties></tile>
 </tileset>

 <tileset firstgid="${GID_M}" name="misc"
          tilewidth="20" tileheight="20" tilecount="18" columns="3">
  <image width="79" height="120" source="bitmaps/misc.png"/>
  <tile id="4"><properties><property name="res_pool" value=""/></properties></tile>
 </tileset>

 <tileset firstgid="${GID_U}" name="units"
          tilewidth="20" tileheight="20" tilecount="8" columns="8">
  <properties><property name="embedded_png" value="${TS.units}"/></properties>
  <image width="160" height="20" source="units.png"/>${utiles}
 </tileset>

 <layer id="1" name="Ground" width="${W}" height="${H}">
  <data encoding="base64" compression="zlib">${b64G}</data>
 </layer>
 <layer id="2" name="Items" width="${W}" height="${H}">
  <data encoding="base64" compression="zlib">${b64I}</data>
 </layer>
 <layer id="3" name="Units" width="${W}" height="${H}">
  <data encoding="base64" compression="zlib">${b64U}</data>
 </layer>
 <objectgroup id="4" name="Triggers">${triggers}
 </objectgroup>
</map>`;
}

/* ══════ EXPORT ══════ */
async function doExp(){
  if(!hmap){toast(t('need_map'),'err');return;}
  setPg(10,'TMX…');await sleep(20);
  const tmx=await buildTMX();
  setPg(85,'…');await sleep(10);
  const fname=`[p${'4'}]gen_${seed}_${W}x${H}.tmx`;
  const blob=new Blob([tmx],{type:'application/octet-stream'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=fname;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},8000);
  setPg(100);
  toast(`✓ ${fname}`);
  closeExp();
}

function savePNG(){
  if(!hmap){toast(t('need_map'),'err');return;}
  const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;
  const cx=tmp.getContext('2d');cx.drawImage(mc,0,0);cx.drawImage(ov,0,0);
  tmp.toBlob(blob=>{
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`rw_${seed}.png`;
    document.body.appendChild(a);a.click();
    setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},8000);
    toast('✓ PNG');
  });
}

/* ══════ PLUGIN SYSTEM ══════ */
// Public API object exposed to plugins
const RWMG = {
  // === DATA ACCESS ===
  getMap:    ()=> hmap ? hmap.slice() : null,
  getWidth:  ()=> W,
  getHeight: ()=> H,
  getSeed:   ()=> seed,
  getBiome:  ()=> gv('sBm'),
  getShape:  ()=> gv('sShape'),
  getWater:  ()=> gv('rWt')/100,
  getMarkers:()=> markers.slice(),

  // === SETTINGS CONTROL ===
  setWater:  (v)=>{ const r=$('rWt'); if(r){r.value=Math.round(v*100); sl(r,'vWt',x=>(x/100).toFixed(2));} },
  setNoise:  (v)=>{ const r=$('rSc'); if(r){r.value=Math.round(v*10); sl(r,'vSc',x=>(x/10).toFixed(1));} },
  setBiome:  (b)=>{ const s=$('sBm'); if(s) s.value=b; },
  setShape:  (s)=>{ const el=$('sShape'); if(el) el.value=s; },
  setSeed:   (s)=>{ const el=$('iSd'); if(el) el.value=s; },

  // === MAP MANIPULATION ===
  generate:  ()=> gen(),
  clearMarkers: ()=> clearM(),
  addMarker: (type,x,y,team=-1)=>{
    markers.push({type,x,y,team});
    redrawOv(); updS(); updMini();
  },
  removeMarkersAt:(x,y,r=3)=>{
    markers=markers.filter(m=>Math.abs(m.x-x)>r||Math.abs(m.y-y)>r);
    redrawOv(); updS(); updMini();
  },
  // Paint arbitrary heightmap changes
  setHeight: (x,y,val)=>{ if(hmap&&x>=0&&x<W&&y>=0&&y<H) hmap[y*W+x]=val; },
  getHeight: (x,y)=>{ return hmap&&x>=0&&x<W&&y>=0&&y<H?hmap[y*W+x]:null; },
  redraw:    ()=>{ if(hmap){ drawT(gv('sBm'),gv('rWt')/100); redrawOv(); updMini(); } },

  // === UI ===
  toast:     (msg,type)=> toast(msg,type),
  addSection:(plugId,titleHtml,bodyHtml)=>{
    const area=document.getElementById('plugExtArea');
    const old=document.getElementById('plug-ui-'+plugId);
    if(old) old.remove();
    const div=document.createElement('div');
    div.id='plug-ui-'+plugId;
    div.className='plug-ext-section';
    div.innerHTML=`<div class="plug-ext-title">${titleHtml}</div>${bodyHtml}`;
    area.appendChild(div);
  },
  removeSection:(plugId)=>{ document.getElementById('plug-ui-'+plugId)?.remove(); },
  addDrawerSection:(plugId,titleHtml,bodyHtml)=>{
    const dr=document.getElementById('dr');
    if(!dr) return;
    const old=document.getElementById('plug-dr-'+plugId);
    if(old) old.remove();
    const div=document.createElement('div');
    div.id='plug-dr-dr'+plugId;
    div.className='ds';
    div.innerHTML=`<div class="dst">${titleHtml}</div>${bodyHtml}`;
    dr.appendChild(div);
  },
  addToolbarBtn:(plugId,label,onclick)=>{
    const tb=document.getElementById('tb');
    if(!tb) return;
    const old=document.getElementById('plug-tb-'+plugId);
    if(old) old.remove();
    const sep=document.createElement('div');sep.className='tsep';sep.id='plug-tb-sep-'+plugId;
    const btn=document.createElement('div');
    btn.className='tl';btn.id='plug-tb-'+plugId;
    btn.innerHTML=label;btn.onclick=onclick;
    tb.insertBefore(sep,tb.querySelector('.tsep'));
    tb.insertBefore(btn,tb.querySelector('.tsep'));
  },
  removeToolbarBtn:(plugId)=>{
    document.getElementById('plug-tb-'+plugId)?.remove();
    document.getElementById('plug-tb-sep-'+plugId)?.remove();
  },

  // === EVENT HOOKS ===
  _hooks:{},
  on:(event,plugId,fn)=>{
    if(!RWMG._hooks[event]) RWMG._hooks[event]={};
    RWMG._hooks[event][plugId]=fn;
  },
  off:(event,plugId)=>{ delete RWMG._hooks[event]?.[plugId]; },
  _emit:(event,...args)=>{
    const h=RWMG._hooks[event];
    if(h) Object.values(h).forEach(fn=>{try{fn(...args);}catch(e){console.error('[RWMG hook]',e);}});
  },

  // === TILESET ===
  Perlin: Perlin,
  noiseShape: noiseShape,
};

// Plugin registry
const _plugins = {};

// Load plugin from JS text
function execPlugin(id, code, filename){
  // Remove old plugin UI if reloading
  const old = _plugins[id];
  if(old && old.onUnload) { try{old.onUnload();}catch(e){} }

  const plugin = { id, filename, name: filename, description: '', version: '', error: null };

  try {
    // Create a sandboxed-ish function with RWMG in scope
    const fn = new Function('RWMG', 'pluginId', code + '\n;return (typeof plugin!=="undefined"?plugin:null);');
    const meta = fn(RWMG, id);
    if(meta && typeof meta === 'object'){
      if(meta.name)        plugin.name        = meta.name;
      if(meta.description) plugin.description = meta.description;
      if(meta.version)     plugin.version     = meta.version;
      if(meta.onLoad)      { try{meta.onLoad();}catch(e){console.error('[plugin onLoad]',e);} }
      if(meta.onUnload)    plugin.onUnload    = meta.onUnload;
    }
    plugin.ok = true;
  } catch(e){
    plugin.error = e.message;
    plugin.ok = false;
    console.error('[plugin error]', e);
  }

  _plugins[id] = plugin;
  renderPluginList();
  return plugin;
}

function loadPlugFile(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const id = 'plug_' + file.name.replace(/[^a-z0-9]/gi,'_');
    const p = execPlugin(id, e.target.result, file.name);
    if(p.ok){
      toast('🧩 ' + (p.name || file.name) + ' loaded');
      document.getElementById('plugBtn').classList.add('on');
    } else {
      toast('⚠ Plugin error: ' + p.error, 'err');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function unloadPlugin(id){
  const p = _plugins[id];
  if(!p) return;
  if(p.onUnload){ try{p.onUnload();}catch(e){} }
  RWMG.removeSection(id);
  RWMG.removeToolbarBtn(id);
  // Remove all hooks for this plugin
  Object.keys(RWMG._hooks).forEach(ev=>RWMG.off(ev,id));
  delete _plugins[id];
  renderPluginList();
  if(Object.keys(_plugins).length===0) document.getElementById('plugBtn').classList.remove('on');
  toast('Plugin removed');
}

function unloadAllPlugins(){
  Object.keys(_plugins).forEach(unloadPlugin);
}

function renderPluginList(){
  const list = document.getElementById('plugList');
  if(!list) return;
  const keys = Object.keys(_plugins);
  if(!keys.length){ list.innerHTML=''; return; }
  list.innerHTML = keys.map(id=>{
    const p = _plugins[id];
    return `<div class="plug-item${p.ok?'':' err'}">
      <div class="plug-item-ic">${p.ok?`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`:'⚠'}</div>
      <div class="plug-item-info">
        <div class="plug-item-name">${p.name}</div>
        <div class="plug-item-desc">${p.ok?(p.description||p.filename):'ERROR: '+p.error}</div>
      </div>
      <div class="plug-item-rm" onclick="unloadPlugin('${id}')">✕</div>
    </div>`;
  }).join('');
}

// Hook gen() to emit event
const _origGen = gen;
gen = function(){
  _origGen();
  setTimeout(()=>RWMG._emit('afterGenerate'),200);
};

// Plugin sheet controls
function openPlug(){  document.getElementById('plugSh').classList.add('on'); buildPlugApiRef(); }
function closePlug(){ document.getElementById('plugSh').classList.remove('on'); }

function buildPlugApiRef(){
  const entries = document.getElementById('plugApiEntries');
  if(!entries) return;
  const api = [
    ['getMap()','→ Float32Array of heightmap (copy)'],
    ['getWidth() / getHeight()','→ number: map dimensions'],
    ['getSeed()','→ number: current seed'],
    ['getBiome() / getShape()','→ string: current biome/shape'],
    ['getWater()','→ number 0..1: water level'],
    ['getMarkers()','→ [{type,x,y,team}] copy'],
    ['generate()','Regenerate the map'],
    ['setHeight(x,y,v)','Write to heightmap'],
    ['redraw()','Re-render terrain from heightmap'],
    ['addMarker(type,x,y,team)','type: "spawn"|"crystal"'],
    ['clearMarkers()','Remove all markers'],
    ['setBiome(b)','"temperate"|"desert"|"arctic"|"volcanic"'],
    ['setShape(s)','"island"|"mainland"|"lakes"|"archipelago"|"mountain"|"peninsula"'],
    ['setWater(v)','Set water level 0..1'],
    ['setNoise(v)','Set noise scale'],
    ['setSeed(s)','Set seed string'],
    ['toast(msg,type)','type: "err"|"warn"|undefined'],
    ['addSection(id,title,html)','Add UI panel below toolbar'],
    ['addToolbarBtn(id,label,fn)','Add button to toolbar'],
    ['removeSection(id)','Remove your UI panel'],
    ['removeToolbarBtn(id)','Remove your toolbar button'],
    ['addDrawerSection(id,title,html)','Add section to settings drawer'],
    ['on(event,id,fn)','Subscribe: "afterGenerate"'],
    ['off(event,id)','Unsubscribe event'],
    ['Perlin','Perlin noise class'],
    ['noiseShape(...)','Internal terrain function'],
  ];
  entries.innerHTML = api.map(([k,v])=>
    `<div class="plug-api-entry"><span class="plug-api-key">${k}</span><span class="plug-api-val">${v}</span></div>`
  ).join('');
}

const PLUG_EXAMPLE = `// Example: Heightmap Inverter Extension
// Save as invert.js and load it

const plugin = {
  name: "Heightmap Inverter",
  description: "Adds Invert button to toolbar",
  version: "1.0",

  onLoad() {
    RWMG.addToolbarBtn(pluginId, 
      '<span class="ic">🔄</span><span style="font-size:8px">Inv</span>',
      () => {
        const map = RWMG.getMap();
        const wl = RWMG.getWater();
        const w = RWMG.getWidth(), h = RWMG.getHeight();
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            RWMG.setHeight(x, y, 1 - map[y*w+x]);
        RWMG.redraw();
        RWMG.toast("🔄 Inverted!");
      }
    );
  },

  onUnload() {
    RWMG.removeToolbarBtn(pluginId);
  }
};`;

function buildPlugExample(){
  const el = document.getElementById('plugExampleCode');
  if(el) el.textContent = PLUG_EXAMPLE;
}
function copyPlugExample(){
  navigator.clipboard?.writeText(PLUG_EXAMPLE).then(()=>toast('Copied!'));
}

// Initialize example on load
window.addEventListener('load',()=>{ buildPlugExample(); });

/* ══════ LOAD TMX ══════ */
function loadTMXFile(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      parseTMX(e.target.result, file.name);
    } catch(err) {
      toast('⚠ ' + err.message, 'err', 4000);
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function parseTMX(xmlStr, filename){
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'application/xml');
  if(doc.querySelector('parsererror')) throw new Error('Invalid XML');

  const mapEl = doc.querySelector('map');
  if(!mapEl) throw new Error('No <map> element');
  const mapW = +mapEl.getAttribute('width');
  const mapH = +mapEl.getAttribute('height');
  if(!mapW || !mapH) throw new Error('Invalid map size');

  /* ── 1. Parse all tilesets → build GID classification tables ── */
  // For each GID we need to know:
  //   isWater, isMountain, isSnow/Ice, isDeepWater, isSand/Shore, isForest, isRock
  //   isCommandCenter (with team number)
  //   isResPool (res_pool property)

  const tsArr = [];
  for(const ts of doc.querySelectorAll('tileset')){
    const fg = +ts.getAttribute('firstgid') || 1;
    const name = (ts.getAttribute('name')||'').toLowerCase();
    const src  = (ts.getAttribute('source')||'').toLowerCase();

    // Collect per-tile properties
    const tileProps = {}; // tid -> Set of prop names
    for(const tile of ts.querySelectorAll('tile')){
      const tid = +tile.getAttribute('id');
      const ps = new Set();
      for(const p of tile.querySelectorAll('property')){
        ps.add(p.getAttribute('name').toLowerCase());
        // Also store value for team/unit
        ps.add(p.getAttribute('name').toLowerCase() + '=' + (p.getAttribute('value')||''));
      }
      tileProps[tid] = ps;
    }

    // Classify whole tileset by name
    const tsIsWater  = /water|shallow|shallowwater/.test(name) || /water/.test(src);
    const tsIsSnow   = /snow|ice/.test(name);
    const tsIsMtn    = /mountain/.test(name);
    const tsIsForest = /forest|longgrass|grass/.test(name);
    const tsIsSand   = /sand|desert/.test(name);
    const tsIsMisc   = name === 'misc' || /misc/.test(name);
    const tsIsCC     = /command/.test(name) || /commandcenter/.test(name);

    tsArr.push({fg, name, src, tileProps, tsIsWater, tsIsSnow, tsIsMtn,
                tsIsForest, tsIsSand, tsIsMisc, tsIsCC});
  }
  tsArr.sort((a,b)=>a.fg-b.fg);

  // Get info for a GID: returns object with flags
  function gidInfo(rawGid){
    const gid = rawGid & 0x1FFFFFFF; // strip flip flags
    if(!gid) return null;
    let best = null;
    for(let i=0;i<tsArr.length;i++){
      const ts = tsArr[i];
      const next = tsArr[i+1] ? tsArr[i+1].fg : 0x7FFFFFFF;
      if(gid >= ts.fg && gid < next){ best = {ts, tid: gid - ts.fg}; break; }
    }
    if(!best) return {isWater:false, isLand:true, height:0.20};
    const {ts, tid} = best;
    const tp = ts.tileProps[tid] || new Set();

    const hasWaterProp = tp.has('water') || tp.has('shallow-water');
    const hasCliff     = tp.has('cliff') || tp.has('large-cliff') || tp.has('block-land');
    const hasMtnProp   = tp.has('small-rock') || tp.has('large-rock');
    const hasTree      = tp.has('tree');
    const hasResPool   = tp.has('res_pool');

    // unit/team for commandCenter
    let isCC = false, ccTeam = -1;
    if(ts.tsIsCC || tp.has('unit=commandcenter') || [...tp].some(p=>p==='unit=commandCenter')){
      isCC = true;
      const teamProp = [...tp].find(p=>p.startsWith('team='));
      ccTeam = teamProp ? +teamProp.split('=')[1] : tid;
    }

    // Terrain category
    const isDeepWater  = ts.tsIsWater && !hasCliff && (hasWaterProp || ts.tsIsWater);
    const isWater      = isDeepWater || hasWaterProp;
    const isMtn        = ts.tsIsMtn || hasMtnProp || ts.name.includes('mountain');
    const isSnow       = ts.tsIsSnow;
    const isForest     = ts.tsIsForest || hasTree;
    const isSand       = ts.tsIsSand;
    const isCliff      = hasCliff;

    return {isWater, isMtn, isSnow, isForest, isSand, isCliff, isCC, ccTeam, hasResPool, tsName: ts.name};
  }

  /* ── 2. Detect biome from tilesets ── */
  let biome = 'temperate';
  for(const ts of tsArr){
    const n = ts.name;
    if(/desert|sand/.test(n)){ biome='desert'; break; }
    if(/snow|ice|arctic/.test(n)){ biome='arctic'; break; }
    if(/volcanic|lava/.test(n)){ biome='volcanic'; break; }
  }

  /* ── 3. Layer decoder (base64+zlib/gzip/none, CSV, XML tiles) ── */
  function decodeLayer(layerEl){
    if(!layerEl) return null;
    const dataEl = layerEl.querySelector('data');
    if(!dataEl) return null;
    const enc  = (dataEl.getAttribute('encoding')||'').toLowerCase();
    const comp = (dataEl.getAttribute('compression')||'').toLowerCase();

    let raw;
    if(enc === 'base64'){
      const b64   = dataEl.textContent.replace(/\s/g,'');
      const bin   = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      if(comp==='zlib')       raw = pako.inflate(bytes);
      else if(comp==='gzip')  raw = pako.ungzip(bytes);
      else                    raw = bytes;
    } else {
      // CSV fallback
      const csv = dataEl.textContent.trim();
      if(csv){
        const nums = csv.replace(/\s/g,'').split(',').map(Number);
        raw = new Uint8Array(nums.length * 4);
        nums.forEach((n,i)=>{ raw[i*4]=n&0xFF; raw[i*4+1]=(n>>8)&0xFF; raw[i*4+2]=(n>>16)&0xFF; raw[i*4+3]=(n>>24)&0xFF; });
      }
    }
    if(!raw) return null;

    const gids = new Uint32Array(mapW * mapH);
    for(let i=0;i<gids.length;i++){
      const o=i*4;
      gids[i] = (raw[o]||0)|((raw[o+1]||0)<<8)|((raw[o+2]||0)<<16)|((raw[o+3]||0)<<24);
    }
    return gids;
  }

  /* ── 4. Find layers ── */
  const layers = [...doc.querySelectorAll('layer')];
  const groundLayer = layers.find(l=>/ground/i.test(l.getAttribute('name')||'')) || layers[0];
  const unitsLayer  = layers.find(l=>/unit/i.test(l.getAttribute('name')||''));
  const itemsLayer  = layers.find(l=>/item/i.test(l.getAttribute('name')||''));

  /* ── 5. Build heightmap from ground GIDs ── */
  const wl = gv('rWt') / 100;
  const H_DEEP  = wl - 0.10;
  const H_SHORE = wl - 0.02;
  const H_SAND  = wl + 0.03;
  const H_PLAIN = wl + 0.12;
  const H_GRASS = wl + 0.28;
  const H_FRST  = wl + 0.42;
  const H_ROCK  = wl + 0.56;
  const H_MTN   = wl + 0.70;
  const H_SNOW  = wl + 0.84;

  const groundGids = decodeLayer(groundLayer);
  const newHmap = new Float32Array(mapW * mapH);
  if(groundGids){
    for(let i=0;i<mapW*mapH;i++){
      const inf = gidInfo(groundGids[i]);
      if(!inf){ newHmap[i] = H_PLAIN; continue; }
      if(inf.isWater){
        // Distinguish deep vs shallow by tileset name
        const n = inf.tsName;
        if(/shallow|shore/.test(n)) newHmap[i] = H_SHORE;
        else newHmap[i] = H_DEEP;
      } else if(inf.isSnow)   newHmap[i] = H_SNOW;
      else if(inf.isMtn)      newHmap[i] = H_MTN;
      else if(inf.isCliff)    newHmap[i] = H_ROCK;
      else if(inf.isForest)   newHmap[i] = H_FRST;
      else if(inf.isSand)     newHmap[i] = H_SAND;
      else                    newHmap[i] = H_GRASS;
    }
  }

  /* ── 6. Extract spawns from Units layer ── */
  const newMarkers = [];
  const unitsGids = decodeLayer(unitsLayer);
  if(unitsGids){
    for(let i=0;i<mapW*mapH;i++){
      const rawG = unitsGids[i];
      if(!rawG) continue;
      const inf = gidInfo(rawG);
      if(inf && inf.isCC){
        newMarkers.push({type:'spawn', x:i%mapW, y:Math.floor(i/mapW), team:inf.ccTeam});
      }
    }
  }

  /* ── 7. Extract resources from Items layer ── */
  const itemsGids = decodeLayer(itemsLayer);
  if(itemsGids){
    // Pass 1: look for tiles with res_pool property (tile id=4 in standard misc)
    const resPosSet = new Set();
    for(let i=0;i<mapW*mapH;i++){
      const rawG = itemsGids[i];
      if(!rawG) continue;
      const inf = gidInfo(rawG);
      if(inf && inf.hasResPool){
        const x=i%mapW, y=Math.floor(i/mapW);
        // Use rounded-to-3x3-center to avoid duplicates from the 3x3 block
        const cx=Math.round(x/3)*3, cy=Math.round(y/3)*3;
        const key=cx+'_'+cy;
        if(!resPosSet.has(key)){
          resPosSet.add(key);
          newMarkers.push({type:'crystal', x, y, team:-1});
        }
      }
    }
    // Pass 2: fallback — any non-zero Items tile not already marked
    if(resPosSet.size===0){
      for(let i=0;i<mapW*mapH;i++){
        const rawG = itemsGids[i] & 0x1FFFFFFF;
        if(!rawG) continue;
        const x=i%mapW, y=Math.floor(i/mapW);
        if(!newMarkers.some(m=>m.type==='crystal'&&Math.abs(m.x-x)<=1&&Math.abs(m.y-y)<=1))
          newMarkers.push({type:'crystal', x, y, team:-1});
      }
    }
  }

  /* ── 8. Apply to global state & render ── */
  W = mapW; H = mapH;
  hmap = newHmap;
  markers = newMarkers;
  seed = 0; // loaded from file

  const bmSel = $('sBm');
  if(bmSel) bmSel.value = biome;

  // Update size slider to closest known size
  const si = SIZES.reduce((bi,sz,i)=>Math.abs(sz-mapW)<Math.abs(SIZES[bi]-mapW)?i:bi, 0);
  $('rSz').value = si;
  $('vSz').textContent = mapW+'×'+mapH;

  drawT(biome, wl);
  redrawOv(); updS(); updMini(); resetV();
  applyLang();

  const spCnt = newMarkers.filter(m=>m.type==='spawn').length;
  const crCnt = newMarkers.filter(m=>m.type==='crystal').length;
  const msg = lang==='ru'
    ? `✓ ${filename} · ${mapW}×${mapH} · ${spCnt} спавнов · ${crCnt} рес.`
    : `✓ ${filename} · ${mapW}×${mapH} · ${spCnt} spawns · ${crCnt} res.`;
  toast(msg, 'ok', 4000);
}

/* ══════ INIT ══════ */
window.addEventListener('load',()=>{gen();applyLang();});
window.addEventListener('resize',()=>{if(hmap) resetV();});
