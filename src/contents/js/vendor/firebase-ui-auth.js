/*! Terms: https://developers.google.com/terms */
(function () {
    var h, aa = "function" == typeof Object.create ? Object.create : function (a) {
        function b() {
        }

        b.prototype = a;
        return new b
    }, ba;
    if ("function" == typeof Object.setPrototypeOf) ba = Object.setPrototypeOf; else {
        var ca;
        a:{
            var da = {hg: !0}, ea = {};
            try {
                ea.__proto__ = da;
                ca = ea.hg;
                break a
            } catch (a) {
            }
            ca = !1
        }
        ba = ca ? function (a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
            return a
        } : null
    }
    var fa = ba;

    function p(a, b) {
        a.prototype = aa(b.prototype);
        a.prototype.constructor = a;
        if (fa) fa(a, b); else for (var c in b) if ("prototype" != c) if (Object.defineProperties) {
            var d = Object.getOwnPropertyDescriptor(b, c);
            d && Object.defineProperty(a, c, d)
        } else a[c] = b[c];
        a.Z = b.prototype
    }

    var ha = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
            a != Array.prototype && a != Object.prototype && (a[b] = c.value)
        },
        ia = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

    function ja(a, b) {
        if (b) {
            var c = ia;
            a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                e in c || (c[e] = {});
                c = c[e]
            }
            a = a[a.length - 1];
            d = c[a];
            b = b(d);
            b != d && null != b && ha(c, a, {configurable: !0, writable: !0, value: b})
        }
    }

    function ka(a) {
        var b = 0;
        return function () {
            return b < a.length ? {done: !1, value: a[b++]} : {done: !0}
        }
    }

    function la() {
        la = function () {
        };
        ia.Symbol || (ia.Symbol = na)
    }

    function oa(a, b) {
        this.Nf = a;
        ha(this, "description", {configurable: !0, writable: !0, value: b})
    }

    oa.prototype.toString = function () {
        return this.Nf
    };
    var na = function () {
        function a(c) {
            if (this instanceof a) throw new TypeError("Symbol is not a constructor");
            return new oa("jscomp_symbol_" + (c || "") + "_" + b++, c)
        }

        var b = 0;
        return a
    }();

    function pa() {
        la();
        var a = ia.Symbol.iterator;
        a || (a = ia.Symbol.iterator = ia.Symbol("Symbol.iterator"));
        "function" != typeof Array.prototype[a] && ha(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function () {
                return qa(ka(this))
            }
        });
        pa = function () {
        }
    }

    function qa(a) {
        pa();
        a = {next: a};
        a[ia.Symbol.iterator] = function () {
            return this
        };
        return a
    }

    function ra(a, b) {
        pa();
        a instanceof String && (a += "");
        var c = 0, d = {
            next: function () {
                if (c < a.length) {
                    var e = c++;
                    return {value: b(e, a[e]), done: !1}
                }
                d.next = function () {
                    return {done: !0, value: void 0}
                };
                return d.next()
            }
        };
        d[Symbol.iterator] = function () {
            return d
        };
        return d
    }

    ja("Array.prototype.values", function (a) {
        return a ? a : function () {
            return ra(this, function (b, c) {
                return c
            })
        }
    });
    ja("Array.prototype.keys", function (a) {
        return a ? a : function () {
            return ra(this, function (b) {
                return b
            })
        }
    });
    ja("Object.is", function (a) {
        return a ? a : function (b, c) {
            return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c
        }
    });
    ja("Array.prototype.includes", function (a) {
        return a ? a : function (b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
                var f = d[c];
                if (f === b || Object.is(f, b)) return !0
            }
            return !1
        }
    });

    function sa(a) {
        var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return b ? b.call(a) : {next: ka(a)}
    }

    ja("Promise", function (a) {
        function b(g) {
            this.B = 0;
            this.na = void 0;
            this.Hb = [];
            var k = this.Ed();
            try {
                g(k.resolve, k.reject)
            } catch (l) {
                k.reject(l)
            }
        }

        function c() {
            this.Wa = null
        }

        function d(g) {
            return g instanceof b ? g : new b(function (k) {
                k(g)
            })
        }

        if (a) return a;
        c.prototype.ue = function (g) {
            if (null == this.Wa) {
                this.Wa = [];
                var k = this;
                this.ve(function () {
                    k.Jg()
                })
            }
            this.Wa.push(g)
        };
        var e = ia.setTimeout;
        c.prototype.ve = function (g) {
            e(g, 0)
        };
        c.prototype.Jg = function () {
            for (; this.Wa && this.Wa.length;) {
                var g = this.Wa;
                this.Wa = [];
                for (var k = 0; k <
                g.length; ++k) {
                    var l = g[k];
                    g[k] = null;
                    try {
                        l()
                    } catch (n) {
                        this.lg(n)
                    }
                }
            }
            this.Wa = null
        };
        c.prototype.lg = function (g) {
            this.ve(function () {
                throw g;
            })
        };
        b.prototype.Ed = function () {
            function g(n) {
                return function (m) {
                    l || (l = !0, n.call(k, m))
                }
            }

            var k = this, l = !1;
            return {resolve: g(this.Bh), reject: g(this.$d)}
        };
        b.prototype.Bh = function (g) {
            if (g === this) this.$d(new TypeError("A Promise cannot resolve to itself")); else if (g instanceof b) this.Gh(g); else {
                a:switch (typeof g) {
                    case "object":
                        var k = null != g;
                        break a;
                    case "function":
                        k = !0;
                        break a;
                    default:
                        k = !1
                }
                k ? this.Ah(g) : this.Qe(g)
            }
        };
        b.prototype.Ah = function (g) {
            var k = void 0;
            try {
                k = g.then
            } catch (l) {
                this.$d(l);
                return
            }
            "function" == typeof k ? this.Hh(k, g) : this.Qe(g)
        };
        b.prototype.$d = function (g) {
            this.wf(2, g)
        };
        b.prototype.Qe = function (g) {
            this.wf(1, g)
        };
        b.prototype.wf = function (g, k) {
            if (0 != this.B) throw Error("Cannot settle(" + g + ", " + k + "): Promise already settled in state" + this.B);
            this.B = g;
            this.na = k;
            this.Lg()
        };
        b.prototype.Lg = function () {
            if (null != this.Hb) {
                for (var g = 0; g < this.Hb.length; ++g) f.ue(this.Hb[g]);
                this.Hb =
                    null
            }
        };
        var f = new c;
        b.prototype.Gh = function (g) {
            var k = this.Ed();
            g.Cc(k.resolve, k.reject)
        };
        b.prototype.Hh = function (g, k) {
            var l = this.Ed();
            try {
                g.call(k, l.resolve, l.reject)
            } catch (n) {
                l.reject(n)
            }
        };
        b.prototype.then = function (g, k) {
            function l(y, F) {
                return "function" == typeof y ? function (ta) {
                    try {
                        n(y(ta))
                    } catch (Z) {
                        m(Z)
                    }
                } : F
            }

            var n, m, u = new b(function (y, F) {
                n = y;
                m = F
            });
            this.Cc(l(g, n), l(k, m));
            return u
        };
        b.prototype["catch"] = function (g) {
            return this.then(void 0, g)
        };
        b.prototype.Cc = function (g, k) {
            function l() {
                switch (n.B) {
                    case 1:
                        g(n.na);
                        break;
                    case 2:
                        k(n.na);
                        break;
                    default:
                        throw Error("Unexpected state: " + n.B);
                }
            }

            var n = this;
            null == this.Hb ? f.ue(l) : this.Hb.push(l)
        };
        b.resolve = d;
        b.reject = function (g) {
            return new b(function (k, l) {
                l(g)
            })
        };
        b.race = function (g) {
            return new b(function (k, l) {
                for (var n = sa(g), m = n.next(); !m.done; m = n.next()) d(m.value).Cc(k, l)
            })
        };
        b.all = function (g) {
            var k = sa(g), l = k.next();
            return l.done ? d([]) : new b(function (n, m) {
                function u(ta) {
                    return function (Z) {
                        y[ta] = Z;
                        F--;
                        0 == F && n(y)
                    }
                }

                var y = [], F = 0;
                do y.push(void 0), F++, d(l.value).Cc(u(y.length -
                    1), m), l = k.next(); while (!l.done)
            })
        };
        return b
    });
    var q = this || self, ua = /^[\w+/_-]+[=]{0,2}$/, va = null;

    function wa() {
    }

    function xa(a) {
        a.Ma = void 0;
        a.Hd = function () {
            return a.Ma ? a.Ma : a.Ma = new a
        }
    }

    function ya(a) {
        var b = typeof a;
        if ("object" == b) if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
        else if ("function" == b && "undefined" == typeof a.call) return "object";
        return b
    }

    function za(a) {
        return "array" == ya(a)
    }

    function Aa(a) {
        var b = ya(a);
        return "array" == b || "object" == b && "number" == typeof a.length
    }

    function Ba(a) {
        return "function" == ya(a)
    }

    function r(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b
    }

    function Ca(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function Da(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function () {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(b, e)
            }
        }
        return function () {
            return a.apply(b, arguments)
        }
    }

    function t(a, b, c) {
        t = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? Ca : Da;
        return t.apply(null, arguments)
    }

    function Ea(a, b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function () {
            var d = c.slice();
            d.push.apply(d, arguments);
            return a.apply(this, d)
        }
    }

    function v(a, b) {
        for (var c in b) a[c] = b[c]
    }

    var Fa = Date.now || function () {
        return +new Date
    };

    function w(a, b) {
        a = a.split(".");
        var c = q;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c = c[d] && c[d] !== Object.prototype[d] ? c[d] : c[d] = {} : c[d] = b
    }

    function x(a, b) {
        function c() {
        }

        c.prototype = b.prototype;
        a.Z = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a
    };

    function Ga(a) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, Ga); else {
            var b = Error().stack;
            b && (this.stack = b)
        }
        a && (this.message = String(a))
    }

    x(Ga, Error);
    Ga.prototype.name = "CustomError";
    var Ha;

    function Ia(a, b) {
        a = a.split("%s");
        for (var c = "", d = a.length - 1, e = 0; e < d; e++) c += a[e] + (e < b.length ? b[e] : "%s");
        Ga.call(this, c + a[d])
    }

    x(Ia, Ga);
    Ia.prototype.name = "AssertionError";

    function Ja(a, b) {
        throw new Ia("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
    };var Ka = Array.prototype.indexOf ? function (a, b) {
        return Array.prototype.indexOf.call(a, b, void 0)
    } : function (a, b) {
        if ("string" === typeof a) return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
        for (var c = 0; c < a.length; c++) if (c in a && a[c] === b) return c;
        return -1
    }, La = Array.prototype.forEach ? function (a, b, c) {
        Array.prototype.forEach.call(a, b, c)
    } : function (a, b, c) {
        for (var d = a.length, e = "string" === typeof a ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
    };

    function Ma(a, b) {
        for (var c = "string" === typeof a ? a.split("") : a, d = a.length - 1; 0 <= d; --d) d in c && b.call(void 0, c[d], d, a)
    }

    var Na = Array.prototype.filter ? function (a, b) {
        return Array.prototype.filter.call(a, b, void 0)
    } : function (a, b) {
        for (var c = a.length, d = [], e = 0, f = "string" === typeof a ? a.split("") : a, g = 0; g < c; g++) if (g in f) {
            var k = f[g];
            b.call(void 0, k, g, a) && (d[e++] = k)
        }
        return d
    }, Oa = Array.prototype.map ? function (a, b) {
        return Array.prototype.map.call(a, b, void 0)
    } : function (a, b) {
        for (var c = a.length, d = Array(c), e = "string" === typeof a ? a.split("") : a, f = 0; f < c; f++) f in e && (d[f] = b.call(void 0, e[f], f, a));
        return d
    }, Pa = Array.prototype.some ? function (a,
                                             b) {
        return Array.prototype.some.call(a, b, void 0)
    } : function (a, b) {
        for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++) if (e in d && b.call(void 0, d[e], e, a)) return !0;
        return !1
    };

    function Qa(a, b, c) {
        for (var d = a.length, e = "string" === typeof a ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return f;
        return -1
    }

    function Ra(a, b) {
        return 0 <= Ka(a, b)
    }

    function Sa(a, b) {
        b = Ka(a, b);
        var c;
        (c = 0 <= b) && Ta(a, b);
        return c
    }

    function Ta(a, b) {
        return 1 == Array.prototype.splice.call(a, b, 1).length
    }

    function Ua(a, b) {
        b = Qa(a, b, void 0);
        0 <= b && Ta(a, b)
    }

    function Va(a, b) {
        var c = 0;
        Ma(a, function (d, e) {
            b.call(void 0, d, e, a) && Ta(a, e) && c++
        })
    }

    function Wa(a) {
        return Array.prototype.concat.apply([], arguments)
    }

    function Xa(a) {
        var b = a.length;
        if (0 < b) {
            for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
            return c
        }
        return []
    }

    function Ya(a, b, c, d) {
        return Array.prototype.splice.apply(a, Za(arguments, 1))
    }

    function Za(a, b, c) {
        return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
    };

    function $a(a, b) {
        this.eh = 100;
        this.Bg = a;
        this.zh = b;
        this.$c = 0;
        this.Sc = null
    }

    $a.prototype.get = function () {
        if (0 < this.$c) {
            this.$c--;
            var a = this.Sc;
            this.Sc = a.next;
            a.next = null
        } else a = this.Bg();
        return a
    };
    $a.prototype.put = function (a) {
        this.zh(a);
        this.$c < this.eh && (this.$c++, a.next = this.Sc, this.Sc = a)
    };
    var ab = String.prototype.trim ? function (a) {
        return a.trim()
    } : function (a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
    };

    function bb(a, b) {
        if (b) a = a.replace(cb, "&amp;").replace(db, "&lt;").replace(eb, "&gt;").replace(fb, "&quot;").replace(gb, "&#39;").replace(hb, "&#0;"); else {
            if (!ib.test(a)) return a;
            -1 != a.indexOf("&") && (a = a.replace(cb, "&amp;"));
            -1 != a.indexOf("<") && (a = a.replace(db, "&lt;"));
            -1 != a.indexOf(">") && (a = a.replace(eb, "&gt;"));
            -1 != a.indexOf('"') && (a = a.replace(fb, "&quot;"));
            -1 != a.indexOf("'") && (a = a.replace(gb, "&#39;"));
            -1 != a.indexOf("\x00") && (a = a.replace(hb, "&#0;"))
        }
        return a
    }

    var cb = /&/g, db = /</g, eb = />/g, fb = /"/g, gb = /'/g, hb = /\x00/g, ib = /[\x00&<>"']/;

    function jb(a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    };var kb;
    a:{
        var lb = q.navigator;
        if (lb) {
            var mb = lb.userAgent;
            if (mb) {
                kb = mb;
                break a
            }
        }
        kb = ""
    }

    function z(a) {
        return -1 != kb.indexOf(a)
    };

    function nb(a, b, c) {
        for (var d in a) b.call(c, a[d], d, a)
    }

    function ob(a, b) {
        for (var c in a) if (b.call(void 0, a[c], c, a)) return !0;
        return !1
    }

    function pb(a) {
        var b = {}, c;
        for (c in a) b[c] = a[c];
        return b
    }

    var qb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

    function rb(a, b) {
        for (var c, d, e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d) a[c] = d[c];
            for (var f = 0; f < qb.length; f++) c = qb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    };

    function sb() {
        return (z("Chrome") || z("CriOS")) && !z("Edge")
    };

    function tb(a, b) {
        var c = ub(a);
        c && "undefined" != typeof c[b] && (a && (a instanceof c[b] || !(a instanceof c.Location || a instanceof c.Element)) || Ja("Argument is not a %s (or a non-Element, non-Location mock); got: %s", b, vb(a)))
    }

    function vb(a) {
        if (r(a)) try {
            return a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a)
        } catch (b) {
            return "<object could not be stringified>"
        } else return void 0 === a ? "undefined" : null === a ? "null" : typeof a
    }

    function ub(a) {
        try {
            var b = a && a.ownerDocument, c = b && (b.defaultView || b.parentWindow);
            c = c || q;
            if (c.Element && c.Location) return c
        } catch (d) {
        }
        return null
    };

    function wb(a, b) {
        this.ie = a === xb && b || "";
        this.fg = yb
    }

    wb.prototype.La = !0;
    wb.prototype.za = function () {
        return this.ie
    };
    wb.prototype.toString = function () {
        return "Const{" + this.ie + "}"
    };

    function zb(a) {
        if (a instanceof wb && a.constructor === wb && a.fg === yb) return a.ie;
        Ja("expected object of type Const, got '" + a + "'");
        return "type_error:Const"
    }

    var yb = {}, xb = {}, Ab = new wb(xb, "");

    function Bb() {
        this.Xd = ""
    }

    Bb.prototype.La = !0;
    Bb.prototype.za = function () {
        return this.Xd.toString()
    };
    Bb.prototype.toString = function () {
        return "SafeScript{" + this.Xd + "}"
    };
    Bb.prototype.nb = function (a) {
        this.Xd = a;
        return this
    };
    (new Bb).nb("");

    function Cb(a, b) {
        this.Zd = a === Db && b || "";
        this.gg = Eb
    }

    h = Cb.prototype;
    h.La = !0;
    h.za = function () {
        return this.Zd.toString()
    };
    h.Pd = !0;
    h.Jc = function () {
        return 1
    };
    h.toString = function () {
        return "TrustedResourceUrl{" + this.Zd + "}"
    };

    function Fb(a) {
        if (a instanceof Cb && a.constructor === Cb && a.gg === Eb) return a.Zd;
        Ja("expected object of type TrustedResourceUrl, got '" + a + "' of type " + ya(a));
        return "type_error:TrustedResourceUrl"
    }

    var Eb = {}, Db = {};

    function Gb(a, b) {
        this.Yd = a === Hb && b || "";
        this.eg = Ib
    }

    h = Gb.prototype;
    h.La = !0;
    h.za = function () {
        return this.Yd.toString()
    };
    h.Pd = !0;
    h.Jc = function () {
        return 1
    };
    h.toString = function () {
        return "SafeUrl{" + this.Yd + "}"
    };

    function Jb(a) {
        if (a instanceof Gb && a.constructor === Gb && a.eg === Ib) return a.Yd;
        Ja("expected object of type SafeUrl, got '" + a + "' of type " + ya(a));
        return "type_error:SafeUrl"
    }

    var Kb = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;

    function Lb(a) {
        if (a instanceof Gb) return a;
        a = "object" == typeof a && a.La ? a.za() : String(a);
        Kb.test(a) || (a = "about:invalid#zClosurez");
        return new Gb(Hb, a)
    }

    function Mb(a) {
        if (a instanceof Gb) return a;
        a = "object" == typeof a && a.La ? a.za() : String(a);
        Kb.test(a) || (a = "about:invalid#zClosurez");
        return new Gb(Hb, a)
    }

    var Ib = {}, Hb = {};

    function Nb() {
        this.ed = "";
        this.dg = Pb
    }

    Nb.prototype.La = !0;
    var Pb = {};
    Nb.prototype.za = function () {
        return this.ed
    };
    Nb.prototype.toString = function () {
        return "SafeStyle{" + this.ed + "}"
    };
    Nb.prototype.nb = function (a) {
        this.ed = a;
        return this
    };
    (new Nb).nb("");

    function Qb() {
        this.dd = "";
        this.cg = Rb
    }

    Qb.prototype.La = !0;
    var Rb = {};
    Qb.prototype.za = function () {
        return this.dd
    };
    Qb.prototype.toString = function () {
        return "SafeStyleSheet{" + this.dd + "}"
    };
    Qb.prototype.nb = function (a) {
        this.dd = a;
        return this
    };
    (new Qb).nb("");

    function Sb() {
        this.cd = "";
        this.bg = Tb;
        this.Je = null
    }

    h = Sb.prototype;
    h.Pd = !0;
    h.Jc = function () {
        return this.Je
    };
    h.La = !0;
    h.za = function () {
        return this.cd.toString()
    };
    h.toString = function () {
        return "SafeHtml{" + this.cd + "}"
    };

    function Ub(a) {
        if (a instanceof Sb && a.constructor === Sb && a.bg === Tb) return a.cd;
        Ja("expected object of type SafeHtml, got '" + a + "' of type " + ya(a));
        return "type_error:SafeHtml"
    }

    function Vb(a) {
        if (a instanceof Sb) return a;
        var b = "object" == typeof a, c = null;
        b && a.Pd && (c = a.Jc());
        return Wb(bb(b && a.La ? a.za() : String(a)), c)
    }

    var Tb = {};

    function Wb(a, b) {
        return (new Sb).nb(a, b)
    }

    Sb.prototype.nb = function (a, b) {
        this.cd = a;
        this.Je = b;
        return this
    };
    Wb("<!DOCTYPE html>", 0);
    var Xb = Wb("", 0);
    Wb("<br>", 0);
    var Yb = function (a) {
        var b = !1, c;
        return function () {
            b || (c = a(), b = !0);
            return c
        }
    }(function () {
        if ("undefined" === typeof document) return !1;
        var a = document.createElement("div"), b = document.createElement("div");
        b.appendChild(document.createElement("div"));
        a.appendChild(b);
        if (!a.firstChild) return !1;
        b = a.firstChild.firstChild;
        a.innerHTML = Ub(Xb);
        return !b.parentElement
    });

    function Zb(a) {
        var b = new Cb(Db, zb(Ab));
        tb(a, "HTMLIFrameElement");
        a.src = Fb(b).toString()
    }

    function $b(a, b) {
        tb(a, "HTMLScriptElement");
        a.src = Fb(b);
        if (null === va) b:{
            b = q.document;
            if ((b = b.querySelector && b.querySelector("script[nonce]")) && (b = b.nonce || b.getAttribute("nonce")) && ua.test(b)) {
                va = b;
                break b
            }
            va = ""
        }
        b = va;
        b && a.setAttribute("nonce", b)
    }

    function ac(a, b) {
        var c = ub(a);
        c && (!a || !(a instanceof c.Location) && a instanceof c.Element) && Ja("Argument is not a Location (or a non-Element mock); got: %s", vb(a));
        b = b instanceof Gb ? b : Mb(b);
        a.assign(Jb(b))
    };

    function bc(a) {
        return a = bb(a, void 0)
    };

    function cc(a) {
        cc[" "](a);
        return a
    }

    cc[" "] = wa;

    function dc(a, b) {
        var c = ec;
        return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a)
    };var fc = z("Opera"), A = z("Trident") || z("MSIE"), gc = z("Edge"), hc = gc || A,
        ic = z("Gecko") && !(-1 != kb.toLowerCase().indexOf("webkit") && !z("Edge")) && !(z("Trident") || z("MSIE")) && !z("Edge"),
        jc = -1 != kb.toLowerCase().indexOf("webkit") && !z("Edge"), kc = jc && z("Mobile"), lc = z("Macintosh");

    function mc() {
        var a = q.document;
        return a ? a.documentMode : void 0
    }

    var nc;
    a:{
        var oc = "", pc = function () {
            var a = kb;
            if (ic) return /rv:([^\);]+)(\)|;)/.exec(a);
            if (gc) return /Edge\/([\d\.]+)/.exec(a);
            if (A) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
            if (jc) return /WebKit\/(\S+)/.exec(a);
            if (fc) return /(?:Version)[ \/]?(\S+)/.exec(a)
        }();
        pc && (oc = pc ? pc[1] : "");
        if (A) {
            var qc = mc();
            if (null != qc && qc > parseFloat(oc)) {
                nc = String(qc);
                break a
            }
        }
        nc = oc
    }
    var rc = nc, ec = {};

    function sc(a) {
        return dc(a, function () {
            for (var b = 0, c = ab(String(rc)).split("."), d = ab(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
                var g = c[f] || "", k = d[f] || "";
                do {
                    g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
                    k = /(\d*)(\D*)(.*)/.exec(k) || ["", "", "", ""];
                    if (0 == g[0].length && 0 == k[0].length) break;
                    b = jb(0 == g[1].length ? 0 : parseInt(g[1], 10), 0 == k[1].length ? 0 : parseInt(k[1], 10)) || jb(0 == g[2].length, 0 == k[2].length) || jb(g[2], k[2]);
                    g = g[3];
                    k = k[3]
                } while (0 == b)
            }
            return 0 <= b
        })
    }

    var tc;
    tc = q.document && A ? mc() : void 0;
    try {
        (new self.OffscreenCanvas(0, 0)).getContext("2d")
    } catch (a) {
    }
    var uc = !A || 9 <= Number(tc), vc = !ic && !A || A && 9 <= Number(tc) || ic && sc("1.9.1");

    function wc(a, b) {
        this.x = void 0 !== a ? a : 0;
        this.y = void 0 !== b ? b : 0
    }

    h = wc.prototype;
    h.clone = function () {
        return new wc(this.x, this.y)
    };
    h.toString = function () {
        return "(" + this.x + ", " + this.y + ")"
    };
    h.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this
    };
    h.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this
    };
    h.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this
    };
    h.translate = function (a, b) {
        a instanceof wc ? (this.x += a.x, this.y += a.y) : (this.x += Number(a), "number" === typeof b && (this.y += b));
        return this
    };
    h.scale = function (a, b) {
        this.x *= a;
        this.y *= "number" === typeof b ? b : a;
        return this
    };

    function xc(a, b) {
        this.width = a;
        this.height = b
    }

    h = xc.prototype;
    h.clone = function () {
        return new xc(this.width, this.height)
    };
    h.toString = function () {
        return "(" + this.width + " x " + this.height + ")"
    };
    h.aspectRatio = function () {
        return this.width / this.height
    };
    h.hc = function () {
        return !(this.width * this.height)
    };
    h.ceil = function () {
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    };
    h.floor = function () {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    h.round = function () {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    h.scale = function (a, b) {
        this.width *= a;
        this.height *= "number" === typeof b ? b : a;
        return this
    };

    function yc(a) {
        return a ? new zc(Ac(a)) : Ha || (Ha = new zc)
    }

    function Bc(a, b) {
        var c = b || document;
        return c.querySelectorAll && c.querySelector ? c.querySelectorAll("." + a) : Cc(document, a, b)
    }

    function Dc(a, b) {
        var c = b || document;
        if (c.getElementsByClassName) a = c.getElementsByClassName(a)[0]; else {
            c = document;
            var d = b || c;
            a = d.querySelectorAll && d.querySelector && a ? d.querySelector(a ? "." + a : "") : Cc(c, a, b)[0] || null
        }
        return a || null
    }

    function Cc(a, b, c) {
        var d;
        a = c || a;
        if (a.querySelectorAll && a.querySelector && b) return a.querySelectorAll(b ? "." + b : "");
        if (b && a.getElementsByClassName) {
            var e = a.getElementsByClassName(b);
            return e
        }
        e = a.getElementsByTagName("*");
        if (b) {
            var f = {};
            for (c = d = 0; a = e[c]; c++) {
                var g = a.className;
                "function" == typeof g.split && Ra(g.split(/\s+/), b) && (f[d++] = a)
            }
            f.length = d;
            return f
        }
        return e
    }

    function Ec(a, b) {
        nb(b, function (c, d) {
            c && "object" == typeof c && c.La && (c = c.za());
            "style" == d ? a.style.cssText = c : "class" == d ? a.className = c : "for" == d ? a.htmlFor = c : Fc.hasOwnProperty(d) ? a.setAttribute(Fc[d], c) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, c) : a[d] = c
        })
    }

    var Fc = {
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        colspan: "colSpan",
        frameborder: "frameBorder",
        height: "height",
        maxlength: "maxLength",
        nonce: "nonce",
        role: "role",
        rowspan: "rowSpan",
        type: "type",
        usemap: "useMap",
        valign: "vAlign",
        width: "width"
    };

    function Gc(a) {
        return a.scrollingElement ? a.scrollingElement : jc || "CSS1Compat" != a.compatMode ? a.body || a.documentElement : a.documentElement
    }

    function Hc(a, b, c, d) {
        function e(g) {
            g && b.appendChild("string" === typeof g ? a.createTextNode(g) : g)
        }

        for (; d < c.length; d++) {
            var f = c[d];
            !Aa(f) || r(f) && 0 < f.nodeType ? e(f) : La(Ic(f) ? Xa(f) : f, e)
        }
    }

    function Jc(a, b) {
        b = String(b);
        "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
        return a.createElement(b)
    }

    function Kc(a) {
        return a && a.parentNode ? a.parentNode.removeChild(a) : null
    }

    function Ac(a) {
        return 9 == a.nodeType ? a : a.ownerDocument || a.document
    }

    function Lc(a, b) {
        if ("textContent" in a) a.textContent = b; else if (3 == a.nodeType) a.data = String(b); else if (a.firstChild && 3 == a.firstChild.nodeType) {
            for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
            a.firstChild.data = String(b)
        } else {
            for (var c; c = a.firstChild;) a.removeChild(c);
            a.appendChild(Ac(a).createTextNode(String(b)))
        }
    }

    function Ic(a) {
        if (a && "number" == typeof a.length) {
            if (r(a)) return "function" == typeof a.item || "string" == typeof a.item;
            if (Ba(a)) return "function" == typeof a.item
        }
        return !1
    }

    function Mc(a, b) {
        return b ? Nc(a, function (c) {
            return !b || "string" === typeof c.className && Ra(c.className.split(/\s+/), b)
        }) : null
    }

    function Nc(a, b) {
        for (var c = 0; a;) {
            if (b(a)) return a;
            a = a.parentNode;
            c++
        }
        return null
    }

    function zc(a) {
        this.ea = a || q.document || document
    }

    h = zc.prototype;
    h.Bb = yc;
    h.fa = function () {
    };
    h.getElementsByTagName = function (a, b) {
        return (b || this.ea).getElementsByTagName(String(a))
    };
    h.Kc = function (a, b) {
        return Bc(a, b || this.ea)
    };
    h.s = function (a, b) {
        return Dc(a, b || this.ea)
    };
    h.Dd = function (a, b, c) {
        var d = this.ea, e = arguments, f = String(e[0]), g = e[1];
        if (!uc && g && (g.name || g.type)) {
            f = ["<", f];
            g.name && f.push(' name="', bc(g.name), '"');
            if (g.type) {
                f.push(' type="', bc(g.type), '"');
                var k = {};
                rb(k, g);
                delete k.type;
                g = k
            }
            f.push(">");
            f = f.join("")
        }
        f = Jc(d, f);
        g && ("string" === typeof g ? f.className = g : za(g) ? f.className = g.join(" ") : Ec(f, g));
        2 < e.length && Hc(d, f, e, 2)
    };
    h.createElement = function (a) {
        return Jc(this.ea, a)
    };
    h.createTextNode = function (a) {
        return this.ea.createTextNode(String(a))
    };
    h.getWindow = function () {
        var a = this.ea;
        return a.parentWindow || a.defaultView
    };
    h.appendChild = function (a, b) {
        a.appendChild(b)
    };
    h.append = function (a, b) {
        Hc(Ac(a), a, arguments, 1)
    };
    h.canHaveChildren = function (a) {
        if (1 != a.nodeType) return !1;
        switch (a.tagName) {
            case "APPLET":
            case "AREA":
            case "BASE":
            case "BR":
            case "COL":
            case "COMMAND":
            case "EMBED":
            case "FRAME":
            case "HR":
            case "IMG":
            case "INPUT":
            case "IFRAME":
            case "ISINDEX":
            case "KEYGEN":
            case "LINK":
            case "NOFRAMES":
            case "NOSCRIPT":
            case "META":
            case "OBJECT":
            case "PARAM":
            case "SCRIPT":
            case "SOURCE":
            case "STYLE":
            case "TRACK":
            case "WBR":
                return !1
        }
        return !0
    };
    h.removeNode = Kc;
    h.Re = function () {
        return vc && void 0 != (void 0).children ? (void 0).children : Na((void 0).childNodes, function (a) {
            return 1 == a.nodeType
        })
    };
    h.contains = function (a, b) {
        if (!a || !b) return !1;
        if (a.contains && 1 == b.nodeType) return a == b || a.contains(b);
        if ("undefined" != typeof a.compareDocumentPosition) return a == b || !!(a.compareDocumentPosition(b) & 16);
        for (; b && a != b;) b = b.parentNode;
        return b == a
    };

    function Oc(a) {
        q.setTimeout(function () {
            throw a;
        }, 0)
    }

    var Pc;

    function Qc() {
        var a = q.MessageChannel;
        "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !z("Presto") && (a = function () {
            var e = Jc(document, "IFRAME");
            e.style.display = "none";
            Zb(e);
            document.documentElement.appendChild(e);
            var f = e.contentWindow;
            e = f.document;
            e.open();
            e.write(Ub(Xb));
            e.close();
            var g = "callImmediate" + Math.random(),
                k = "file:" == f.location.protocol ? "*" : f.location.protocol + "//" + f.location.host;
            e = t(function (l) {
                    if (("*" == k || l.origin == k) && l.data == g) this.port1.onmessage()
                },
                this);
            f.addEventListener("message", e, !1);
            this.port1 = {};
            this.port2 = {
                postMessage: function () {
                    f.postMessage(g, k)
                }
            }
        });
        if ("undefined" !== typeof a && !z("Trident") && !z("MSIE")) {
            var b = new a, c = {}, d = c;
            b.port1.onmessage = function () {
                if (void 0 !== c.next) {
                    c = c.next;
                    var e = c.Ce;
                    c.Ce = null;
                    e()
                }
            };
            return function (e) {
                d.next = {Ce: e};
                d = d.next;
                b.port2.postMessage(0)
            }
        }
        return "undefined" !== typeof document && "onreadystatechange" in Jc(document, "SCRIPT") ? function (e) {
            var f = Jc(document, "SCRIPT");
            f.onreadystatechange = function () {
                f.onreadystatechange =
                    null;
                f.parentNode.removeChild(f);
                f = null;
                e();
                e = null
            };
            document.documentElement.appendChild(f)
        } : function (e) {
            q.setTimeout(e, 0)
        }
    };

    function Rc() {
        this.pd = this.Rb = null
    }

    var Tc = new $a(function () {
        return new Sc
    }, function (a) {
        a.reset()
    });
    Rc.prototype.add = function (a, b) {
        var c = Tc.get();
        c.set(a, b);
        this.pd ? this.pd.next = c : this.Rb = c;
        this.pd = c
    };
    Rc.prototype.remove = function () {
        var a = null;
        this.Rb && (a = this.Rb, this.Rb = this.Rb.next, this.Rb || (this.pd = null), a.next = null);
        return a
    };

    function Sc() {
        this.next = this.scope = this.Gd = null
    }

    Sc.prototype.set = function (a, b) {
        this.Gd = a;
        this.scope = b;
        this.next = null
    };
    Sc.prototype.reset = function () {
        this.next = this.scope = this.Gd = null
    };

    function Uc(a, b) {
        Vc || Wc();
        Xc || (Vc(), Xc = !0);
        Yc.add(a, b)
    }

    var Vc;

    function Wc() {
        if (q.Promise && q.Promise.resolve) {
            var a = q.Promise.resolve(void 0);
            Vc = function () {
                a.then(Zc)
            }
        } else Vc = function () {
            var b = Zc;
            !Ba(q.setImmediate) || q.Window && q.Window.prototype && !z("Edge") && q.Window.prototype.setImmediate == q.setImmediate ? (Pc || (Pc = Qc()), Pc(b)) : q.setImmediate(b)
        }
    }

    var Xc = !1, Yc = new Rc;

    function Zc() {
        for (var a; a = Yc.remove();) {
            try {
                a.Gd.call(a.scope)
            } catch (b) {
                Oc(b)
            }
            Tc.put(a)
        }
        Xc = !1
    };

    function $c(a) {
        this.ic = a;
        this.ha = this.ic.length / 4;
        this.pb = this.ha + 6;
        this.B = [[], [], [], []];
        this.Mb = [[], [], [], []];
        this.ga = Array(ad * (this.pb + 1));
        for (a = 0; a < this.ha; a++) this.ga[a] = [this.ic[4 * a], this.ic[4 * a + 1], this.ic[4 * a + 2], this.ic[4 * a + 3]];
        var b = Array(4);
        for (a = this.ha; a < ad * (this.pb + 1); a++) {
            b[0] = this.ga[a - 1][0];
            b[1] = this.ga[a - 1][1];
            b[2] = this.ga[a - 1][2];
            b[3] = this.ga[a - 1][3];
            if (0 == a % this.ha) {
                var c = b, d = c[0];
                c[0] = c[1];
                c[1] = c[2];
                c[2] = c[3];
                c[3] = d;
                bd(b);
                b[0] ^= cd[a / this.ha][0];
                b[1] ^= cd[a / this.ha][1];
                b[2] ^= cd[a /
                this.ha][2];
                b[3] ^= cd[a / this.ha][3]
            } else 6 < this.ha && 4 == a % this.ha && bd(b);
            this.ga[a] = Array(4);
            this.ga[a][0] = this.ga[a - this.ha][0] ^ b[0];
            this.ga[a][1] = this.ga[a - this.ha][1] ^ b[1];
            this.ga[a][2] = this.ga[a - this.ha][2] ^ b[2];
            this.ga[a][3] = this.ga[a - this.ha][3] ^ b[3]
        }
    }

    $c.prototype.Of = 16;
    var ad = $c.prototype.Of / 4;
    $c.prototype.encrypt = function (a) {
        dd(this, a);
        ed(this, 0);
        for (a = 1; a < this.pb; ++a) {
            fd(this, gd);
            hd(this);
            for (var b = this.B, c = this.Mb[0], d = 0; 4 > d; d++) c[0] = b[0][d], c[1] = b[1][d], c[2] = b[2][d], c[3] = b[3][d], b[0][d] = id[c[0]] ^ jd[c[1]] ^ c[2] ^ c[3], b[1][d] = c[0] ^ id[c[1]] ^ jd[c[2]] ^ c[3], b[2][d] = c[0] ^ c[1] ^ id[c[2]] ^ jd[c[3]], b[3][d] = jd[c[0]] ^ c[1] ^ c[2] ^ id[c[3]];
            ed(this, a)
        }
        fd(this, gd);
        hd(this);
        ed(this, this.pb);
        return kd(this)
    };
    $c.prototype.decrypt = function (a) {
        dd(this, a);
        ed(this, this.pb);
        for (a = 1; a < this.pb; ++a) {
            ld(this);
            fd(this, md);
            ed(this, this.pb - a);
            for (var b = this.B, c = this.Mb[0], d = 0; 4 > d; d++) c[0] = b[0][d], c[1] = b[1][d], c[2] = b[2][d], c[3] = b[3][d], b[0][d] = nd[c[0]] ^ od[c[1]] ^ pd[c[2]] ^ qd[c[3]], b[1][d] = qd[c[0]] ^ nd[c[1]] ^ od[c[2]] ^ pd[c[3]], b[2][d] = pd[c[0]] ^ qd[c[1]] ^ nd[c[2]] ^ od[c[3]], b[3][d] = od[c[0]] ^ pd[c[1]] ^ qd[c[2]] ^ nd[c[3]]
        }
        ld(this);
        fd(this, md);
        ed(this, 0);
        return kd(this)
    };

    function dd(a, b) {
        for (var c, d = 0; d < ad; d++) for (var e = 0; 4 > e; e++) c = 4 * e + d, c = b[c], a.B[d][e] = c
    }

    function kd(a) {
        for (var b = [], c = 0; c < ad; c++) for (var d = 0; 4 > d; d++) b[4 * d + c] = a.B[c][d];
        return b
    }

    function ed(a, b) {
        for (var c = 0; 4 > c; c++) for (var d = 0; 4 > d; d++) a.B[c][d] ^= a.ga[4 * b + d][c]
    }

    function fd(a, b) {
        for (var c = 0; 4 > c; c++) for (var d = 0; 4 > d; d++) a.B[c][d] = b[a.B[c][d]]
    }

    function hd(a) {
        for (var b = 1; 4 > b; b++) for (var c = 0; 4 > c; c++) a.Mb[b][c] = a.B[b][c];
        for (b = 1; 4 > b; b++) for (c = 0; 4 > c; c++) a.B[b][c] = a.Mb[b][(c + b) % ad]
    }

    function ld(a) {
        for (var b = 1; 4 > b; b++) for (var c = 0; 4 > c; c++) a.Mb[b][(c + b) % ad] = a.B[b][c];
        for (b = 1; 4 > b; b++) for (c = 0; 4 > c; c++) a.B[b][c] = a.Mb[b][c]
    }

    function bd(a) {
        a[0] = gd[a[0]];
        a[1] = gd[a[1]];
        a[2] = gd[a[2]];
        a[3] = gd[a[3]]
    }

    var gd = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126,
            61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
        md = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47,
            255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241,
            26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],
        cd = [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0], [16, 0, 0, 0], [32, 0, 0, 0], [64, 0, 0, 0], [128, 0, 0, 0], [27, 0, 0, 0], [54, 0, 0, 0]],
        id = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,
            32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29, 19, 17, 23, 21, 11, 9, 15, 13, 3, 1, 7, 5, 59, 57, 63, 61, 51, 49, 55, 53, 43, 41, 47, 45, 35, 33, 39,
            37, 91, 89, 95, 93, 83, 81, 87, 85, 75, 73, 79, 77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107, 105, 111, 109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137, 143, 141, 131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171, 169, 175, 173, 163, 161, 167, 165, 219, 217, 223, 221, 211, 209, 215, 213, 203, 201, 207, 205, 195, 193, 199, 197, 251, 249, 255, 253, 243, 241, 247, 245, 235, 233, 239, 237, 227, 225, 231, 229],
        jd = [0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53, 60, 63, 58, 57, 40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111, 106, 105, 120, 123,
            126, 125, 116, 119, 114, 113, 80, 83, 86, 85, 92, 95, 90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192, 195, 198, 197, 204, 207, 202, 201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246, 245, 252, 255, 250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172, 175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149, 156, 159, 154, 153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157, 158, 151, 148, 145, 146, 131, 128, 133, 134, 143, 140, 137, 138, 171, 168, 173, 174, 167, 164, 161, 162, 179, 176, 181, 182, 191, 188, 185, 186, 251, 248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230,
            239, 236, 233, 234, 203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217, 218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107, 104, 109, 110, 103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59, 56, 61, 62, 55, 52, 49, 50, 35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14, 7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26],
        qd = [0, 9, 18, 27, 36, 45, 54, 63, 72, 65, 90, 83, 108, 101, 126, 119, 144, 153, 130, 139, 180, 189, 166, 175, 216, 209, 202, 195, 252, 245, 238, 231, 59, 50, 41, 32, 31, 22, 13, 4, 115, 122, 97, 104, 87, 94, 69, 76, 171, 162, 185, 176, 143, 134, 157, 148, 227, 234, 241, 248, 199,
            206, 213, 220, 118, 127, 100, 109, 82, 91, 64, 73, 62, 55, 44, 37, 26, 19, 8, 1, 230, 239, 244, 253, 194, 203, 208, 217, 174, 167, 188, 181, 138, 131, 152, 145, 77, 68, 95, 86, 105, 96, 123, 114, 5, 12, 23, 30, 33, 40, 51, 58, 221, 212, 207, 198, 249, 240, 235, 226, 149, 156, 135, 142, 177, 184, 163, 170, 236, 229, 254, 247, 200, 193, 218, 211, 164, 173, 182, 191, 128, 137, 146, 155, 124, 117, 110, 103, 88, 81, 74, 67, 52, 61, 38, 47, 16, 25, 2, 11, 215, 222, 197, 204, 243, 250, 225, 232, 159, 150, 141, 132, 187, 178, 169, 160, 71, 78, 85, 92, 99, 106, 113, 120, 15, 6, 29, 20, 43, 34, 57, 48, 154, 147, 136, 129, 190, 183, 172, 165,
            210, 219, 192, 201, 246, 255, 228, 237, 10, 3, 24, 17, 46, 39, 60, 53, 66, 75, 80, 89, 102, 111, 116, 125, 161, 168, 179, 186, 133, 140, 151, 158, 233, 224, 251, 242, 205, 196, 223, 214, 49, 56, 35, 42, 21, 28, 7, 14, 121, 112, 107, 98, 93, 84, 79, 70],
        od = [0, 11, 22, 29, 44, 39, 58, 49, 88, 83, 78, 69, 116, 127, 98, 105, 176, 187, 166, 173, 156, 151, 138, 129, 232, 227, 254, 245, 196, 207, 210, 217, 123, 112, 109, 102, 87, 92, 65, 74, 35, 40, 53, 62, 15, 4, 25, 18, 203, 192, 221, 214, 231, 236, 241, 250, 147, 152, 133, 142, 191, 180, 169, 162, 246, 253, 224, 235, 218, 209, 204, 199, 174, 165, 184, 179, 130, 137, 148, 159, 70, 77,
            80, 91, 106, 97, 124, 119, 30, 21, 8, 3, 50, 57, 36, 47, 141, 134, 155, 144, 161, 170, 183, 188, 213, 222, 195, 200, 249, 242, 239, 228, 61, 54, 43, 32, 17, 26, 7, 12, 101, 110, 115, 120, 73, 66, 95, 84, 247, 252, 225, 234, 219, 208, 205, 198, 175, 164, 185, 178, 131, 136, 149, 158, 71, 76, 81, 90, 107, 96, 125, 118, 31, 20, 9, 2, 51, 56, 37, 46, 140, 135, 154, 145, 160, 171, 182, 189, 212, 223, 194, 201, 248, 243, 238, 229, 60, 55, 42, 33, 16, 27, 6, 13, 100, 111, 114, 121, 72, 67, 94, 85, 1, 10, 23, 28, 45, 38, 59, 48, 89, 82, 79, 68, 117, 126, 99, 104, 177, 186, 167, 172, 157, 150, 139, 128, 233, 226, 255, 244, 197, 206, 211, 216, 122,
            113, 108, 103, 86, 93, 64, 75, 34, 41, 52, 63, 14, 5, 24, 19, 202, 193, 220, 215, 230, 237, 240, 251, 146, 153, 132, 143, 190, 181, 168, 163],
        pd = [0, 13, 26, 23, 52, 57, 46, 35, 104, 101, 114, 127, 92, 81, 70, 75, 208, 221, 202, 199, 228, 233, 254, 243, 184, 181, 162, 175, 140, 129, 150, 155, 187, 182, 161, 172, 143, 130, 149, 152, 211, 222, 201, 196, 231, 234, 253, 240, 107, 102, 113, 124, 95, 82, 69, 72, 3, 14, 25, 20, 55, 58, 45, 32, 109, 96, 119, 122, 89, 84, 67, 78, 5, 8, 31, 18, 49, 60, 43, 38, 189, 176, 167, 170, 137, 132, 147, 158, 213, 216, 207, 194, 225, 236, 251, 246, 214, 219, 204, 193, 226, 239, 248, 245, 190, 179, 164,
            169, 138, 135, 144, 157, 6, 11, 28, 17, 50, 63, 40, 37, 110, 99, 116, 121, 90, 87, 64, 77, 218, 215, 192, 205, 238, 227, 244, 249, 178, 191, 168, 165, 134, 139, 156, 145, 10, 7, 16, 29, 62, 51, 36, 41, 98, 111, 120, 117, 86, 91, 76, 65, 97, 108, 123, 118, 85, 88, 79, 66, 9, 4, 19, 30, 61, 48, 39, 42, 177, 188, 171, 166, 133, 136, 159, 146, 217, 212, 195, 206, 237, 224, 247, 250, 183, 186, 173, 160, 131, 142, 153, 148, 223, 210, 197, 200, 235, 230, 241, 252, 103, 106, 125, 112, 83, 94, 73, 68, 15, 2, 21, 24, 59, 54, 33, 44, 12, 1, 22, 27, 56, 53, 34, 47, 100, 105, 126, 115, 80, 93, 74, 71, 220, 209, 198, 203, 232, 229, 242, 255, 180, 185,
            174, 163, 128, 141, 154, 151],
        nd = [0, 14, 28, 18, 56, 54, 36, 42, 112, 126, 108, 98, 72, 70, 84, 90, 224, 238, 252, 242, 216, 214, 196, 202, 144, 158, 140, 130, 168, 166, 180, 186, 219, 213, 199, 201, 227, 237, 255, 241, 171, 165, 183, 185, 147, 157, 143, 129, 59, 53, 39, 41, 3, 13, 31, 17, 75, 69, 87, 89, 115, 125, 111, 97, 173, 163, 177, 191, 149, 155, 137, 135, 221, 211, 193, 207, 229, 235, 249, 247, 77, 67, 81, 95, 117, 123, 105, 103, 61, 51, 33, 47, 5, 11, 25, 23, 118, 120, 106, 100, 78, 64, 82, 92, 6, 8, 26, 20, 62, 48, 34, 44, 150, 152, 138, 132, 174, 160, 178, 188, 230, 232, 250, 244, 222, 208, 194, 204, 65, 79, 93, 83, 121,
            119, 101, 107, 49, 63, 45, 35, 9, 7, 21, 27, 161, 175, 189, 179, 153, 151, 133, 139, 209, 223, 205, 195, 233, 231, 245, 251, 154, 148, 134, 136, 162, 172, 190, 176, 234, 228, 246, 248, 210, 220, 206, 192, 122, 116, 102, 104, 66, 76, 94, 80, 10, 4, 22, 24, 50, 60, 46, 32, 236, 226, 240, 254, 212, 218, 200, 198, 156, 146, 128, 142, 164, 170, 184, 182, 12, 2, 16, 30, 52, 58, 40, 38, 124, 114, 96, 110, 68, 74, 88, 86, 55, 57, 43, 37, 15, 1, 19, 29, 71, 73, 91, 85, 127, 113, 99, 109, 215, 217, 203, 197, 239, 225, 243, 253, 167, 169, 187, 181, 159, 145, 131, 141];

    function rd(a) {
        for (var b = [], c = 0, d = 0; d < a.length; d++) {
            var e = a.charCodeAt(d);
            255 < e && (b[c++] = e & 255, e >>= 8);
            b[c++] = e
        }
        return b
    }

    function sd(a) {
        return Oa(a, function (b) {
            b = b.toString(16);
            return 1 < b.length ? b : "0" + b
        }).join("")
    };var td = Object.freeze || function (a) {
        return a
    };

    function ud(a, b, c) {
        this.reset(a, b, c, void 0, void 0)
    }

    ud.prototype.Hc = null;
    var vd = 0;
    ud.prototype.reset = function (a, b, c, d, e) {
        "number" == typeof e || vd++;
        this.Df = d || Fa();
        this.ob = a;
        this.kh = b;
        this.cf = c;
        delete this.Hc
    };
    ud.prototype.vf = function (a) {
        this.ob = a
    };

    function wd(a) {
        this.df = a;
        this.ec = this.Ga = this.ob = this.F = null
    }

    function xd(a, b) {
        this.name = a;
        this.value = b
    }

    xd.prototype.toString = function () {
        return this.name
    };
    var yd = new xd("SEVERE", 1E3), zd = new xd("WARNING", 900), Ad = new xd("INFO", 800), Bd = new xd("CONFIG", 700);
    h = wd.prototype;
    h.getName = function () {
        return this.df
    };
    h.getParent = function () {
        return this.F
    };
    h.Re = function () {
        this.Ga || (this.Ga = {});
        return this.Ga
    };
    h.vf = function (a) {
        this.ob = a
    };

    function Cd(a) {
        if (a.ob) return a.ob;
        if (a.F) return Cd(a.F);
        Ja("Root logger has no level set.");
        return null
    }

    h.log = function (a, b, c) {
        if (a.value >= Cd(this).value) for (Ba(b) && (b = b()), a = new ud(a, String(b), this.df), c && (a.Hc = c), c = this; c;) {
            var d = c, e = a;
            if (d.ec) for (var f = 0; b = d.ec[f]; f++) b(e);
            c = c.getParent()
        }
    };
    h.info = function (a, b) {
        this.log(Ad, a, b)
    };
    h.config = function (a, b) {
        this.log(Bd, a, b)
    };
    var Dd = {}, Ed = null;

    function Fd() {
        Ed || (Ed = new wd(""), Dd[""] = Ed, Ed.vf(Bd))
    }

    function Gd(a) {
        Fd();
        var b;
        if (!(b = Dd[a])) {
            b = new wd(a);
            var c = a.lastIndexOf("."), d = a.substr(c + 1);
            c = Gd(a.substr(0, c));
            c.Re()[d] = b;
            b.F = c;
            Dd[a] = b
        }
        return b
    };

    function Hd() {
        this.sf = Fa()
    }

    var Id = null;
    Hd.prototype.set = function (a) {
        this.sf = a
    };
    Hd.prototype.reset = function () {
        this.set(Fa())
    };
    Hd.prototype.get = function () {
        return this.sf
    };

    function Jd(a) {
        this.cb = a || "";
        Id || (Id = new Hd);
        this.Vh = Id
    }

    h = Jd.prototype;
    h.te = !0;
    h.xf = !0;
    h.Kh = !0;
    h.Ih = !0;
    h.yf = !1;
    h.Mh = !1;

    function Kd(a) {
        return 10 > a ? "0" + a : String(a)
    }

    function Ld(a, b) {
        a = (a.Df - b) / 1E3;
        b = a.toFixed(3);
        var c = 0;
        if (1 > a) c = 2; else for (; 100 > a;) c++, a *= 10;
        for (; 0 < c--;) b = " " + b;
        return b
    }

    function Md(a) {
        Jd.call(this, a)
    }

    x(Md, Jd);

    function Nd(a, b) {
        var c = [];
        c.push(a.cb, " ");
        if (a.xf) {
            var d = new Date(b.Df);
            c.push("[", Kd(d.getFullYear() - 2E3) + Kd(d.getMonth() + 1) + Kd(d.getDate()) + " " + Kd(d.getHours()) + ":" + Kd(d.getMinutes()) + ":" + Kd(d.getSeconds()) + "." + Kd(Math.floor(d.getMilliseconds() / 10)), "] ")
        }
        a.Kh && c.push("[", Ld(b, a.Vh.get()), "s] ");
        a.Ih && c.push("[", b.cf, "] ");
        a.Mh && c.push("[", b.ob.name, "] ");
        c.push(b.kh);
        a.yf && (b = b.Hc) && c.push("\n", b instanceof Error ? b.message : b.toString());
        a.te && c.push("\n");
        return c.join("")
    };

    function Od() {
        this.th = t(this.jg, this);
        this.Ic = new Md;
        this.Ic.xf = !1;
        this.Ic.yf = !1;
        this.Ye = this.Ic.te = !1;
        this.Mg = {}
    }

    Od.prototype.jg = function (a) {
        function b(f) {
            if (f) {
                if (f.value >= yd.value) return "error";
                if (f.value >= zd.value) return "warn";
                if (f.value >= Bd.value) return "log"
            }
            return "debug"
        }

        if (!this.Mg[a.cf]) {
            var c = Nd(this.Ic, a), d = Pd;
            if (d) {
                var e = b(a.ob);
                Qd(d, e, c, a.Hc)
            }
        }
    };
    var Pd = q.console;

    function Qd(a, b, c, d) {
        if (a[b]) a[b](c, d || ""); else a.log(c, d || "")
    };

    function Rd() {
        this.zb = this.zb;
        this.qb = this.qb
    }

    Rd.prototype.zb = !1;
    Rd.prototype.isDisposed = function () {
        return this.zb
    };
    Rd.prototype.i = function () {
        this.zb || (this.zb = !0, this.h())
    };

    function Sd(a, b) {
        a.zb ? b() : (a.qb || (a.qb = []), a.qb.push(b))
    }

    Rd.prototype.h = function () {
        if (this.qb) for (; this.qb.length;) this.qb.shift()()
    };

    function Td(a) {
        a && "function" == typeof a.i && a.i()
    };

    function Ud(a) {
        return "string" == typeof a.className ? a.className : a.getAttribute && a.getAttribute("class") || ""
    }

    function Vd(a, b) {
        "string" == typeof a.className ? a.className = b : a.setAttribute && a.setAttribute("class", b)
    }

    function Wd(a, b) {
        return a.classList ? a.classList.contains(b) : Ra(a.classList ? a.classList : Ud(a).match(/\S+/g) || [], b)
    }

    function Xd(a, b) {
        if (a.classList) a.classList.add(b); else if (!Wd(a, b)) {
            var c = Ud(a);
            Vd(a, c + (0 < c.length ? " " + b : b))
        }
    }

    function Yd(a, b) {
        a.classList ? a.classList.remove(b) : Wd(a, b) && Vd(a, Na(a.classList ? a.classList : Ud(a).match(/\S+/g) || [], function (c) {
            return c != b
        }).join(" "))
    };var Zd = !A && !(z("Safari") && !(sb() || z("Coast") || z("Opera") || z("Edge") || z("Edg/") || z("OPR") || z("Firefox") || z("FxiOS") || z("Silk") || z("Android")));

    function $d(a, b) {
        if (/-[a-z]/.test(b)) return null;
        if (Zd && a.dataset) {
            if (!(!z("Android") || sb() || z("Firefox") || z("FxiOS") || z("Opera") || z("Silk") || b in a.dataset)) return null;
            a = a.dataset[b];
            return void 0 === a ? null : a
        }
        return a.getAttribute("data-" + String(b).replace(/([A-Z])/g, "-$1").toLowerCase())
    };var ae = "StopIteration" in q ? q.StopIteration : {message: "StopIteration", stack: ""};

    function be() {
    }

    be.prototype.next = function () {
        throw ae;
    };
    be.prototype.fb = function () {
        return this
    };

    function ce(a) {
        if (a instanceof be) return a;
        if ("function" == typeof a.fb) return a.fb(!1);
        if (Aa(a)) {
            var b = 0, c = new be;
            c.next = function () {
                for (; ;) {
                    if (b >= a.length) throw ae;
                    if (b in a) return a[b++];
                    b++
                }
            };
            return c
        }
        throw Error("Not implemented");
    }

    function de(a, b) {
        if (Aa(a)) try {
            La(a, b, void 0)
        } catch (c) {
            if (c !== ae) throw c;
        } else {
            a = ce(a);
            try {
                for (; ;) b.call(void 0, a.next(), void 0, a)
            } catch (c) {
                if (c !== ae) throw c;
            }
        }
    }

    function ee(a) {
        if (Aa(a)) return Xa(a);
        a = ce(a);
        var b = [];
        de(a, function (c) {
            b.push(c)
        });
        return b
    };

    function fe(a, b) {
        this.Ba = {};
        this.J = [];
        this.Qb = this.K = 0;
        var c = arguments.length;
        if (1 < c) {
            if (c % 2) throw Error("Uneven number of arguments");
            for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
        } else a && this.addAll(a)
    }

    h = fe.prototype;
    h.qa = function () {
        ge(this);
        for (var a = [], b = 0; b < this.J.length; b++) a.push(this.Ba[this.J[b]]);
        return a
    };
    h.Ja = function () {
        ge(this);
        return this.J.concat()
    };
    h.Ya = function (a) {
        return he(this.Ba, a)
    };
    h.hc = function () {
        return 0 == this.K
    };
    h.clear = function () {
        this.Ba = {};
        this.Qb = this.K = this.J.length = 0
    };
    h.remove = function (a) {
        return he(this.Ba, a) ? (delete this.Ba[a], this.K--, this.Qb++, this.J.length > 2 * this.K && ge(this), !0) : !1
    };

    function ge(a) {
        if (a.K != a.J.length) {
            for (var b = 0, c = 0; b < a.J.length;) {
                var d = a.J[b];
                he(a.Ba, d) && (a.J[c++] = d);
                b++
            }
            a.J.length = c
        }
        if (a.K != a.J.length) {
            var e = {};
            for (c = b = 0; b < a.J.length;) d = a.J[b], he(e, d) || (a.J[c++] = d, e[d] = 1), b++;
            a.J.length = c
        }
    }

    h.get = function (a, b) {
        return he(this.Ba, a) ? this.Ba[a] : b
    };
    h.set = function (a, b) {
        he(this.Ba, a) || (this.K++, this.J.push(a), this.Qb++);
        this.Ba[a] = b
    };
    h.addAll = function (a) {
        if (a instanceof fe) for (var b = a.Ja(), c = 0; c < b.length; c++) this.set(b[c], a.get(b[c])); else for (b in a) this.set(b, a[b])
    };
    h.forEach = function (a, b) {
        for (var c = this.Ja(), d = 0; d < c.length; d++) {
            var e = c[d], f = this.get(e);
            a.call(b, f, e, this)
        }
    };
    h.clone = function () {
        return new fe(this)
    };
    h.fb = function (a) {
        ge(this);
        var b = 0, c = this.Qb, d = this, e = new be;
        e.next = function () {
            if (c != d.Qb) throw Error("The map has changed since the iterator was created");
            if (b >= d.J.length) throw ae;
            var f = d.J[b++];
            return a ? f : d.Ba[f]
        };
        return e
    };

    function he(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };

    function ie(a, b, c) {
        b || (b = {});
        c = c || window;
        var d = a instanceof Gb ? a : Lb("undefined" != typeof a.href ? a.href : String(a));
        a = b.target || a.target;
        var e = [];
        for (f in b) switch (f) {
            case "width":
            case "height":
            case "top":
            case "left":
                e.push(f + "=" + b[f]);
                break;
            case "target":
            case "noopener":
            case "noreferrer":
                break;
            default:
                e.push(f + "=" + (b[f] ? 1 : 0))
        }
        var f = e.join(",");
        if ((z("iPhone") && !z("iPod") && !z("iPad") || z("iPad") || z("iPod")) && c.navigator && c.navigator.standalone && a && "_self" != a) f = Jc(document, "A"), tb(f, "HTMLAnchorElement"),
            d = d instanceof Gb ? d : Mb(d), f.href = Jb(d), f.setAttribute("target", a), b.noreferrer && f.setAttribute("rel", "noreferrer"), b = document.createEvent("MouseEvent"), b.initMouseEvent("click", !0, !0, c, 1), f.dispatchEvent(b), c = {}; else if (b.noreferrer) {
            if (c = c.open("", a, f), b = Jb(d), c && (hc && -1 != b.indexOf(";") && (b = "'" + b.replace(/'/g, "%27") + "'"), c.opener = null, b = '<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url=' + bc(b) + '">', b = Wb(b, null), d = c.document)) d.write(Ub(b)), d.close()
        } else (c = c.open(Jb(d),
            a, f)) && b.noopener && (c.opener = null);
        return c
    };

    function je(a) {
        var b = a.type;
        if ("string" === typeof b) switch (b.toLowerCase()) {
            case "checkbox":
            case "radio":
                return a.checked ? a.value : null;
            case "select-one":
                return b = a.selectedIndex, 0 <= b ? a.options[b].value : null;
            case "select-multiple":
                b = [];
                for (var c, d = 0; c = a.options[d]; d++) c.selected && b.push(c.value);
                return b.length ? b : null
        }
        return null != a.value ? a.value : null
    }

    function ke(a, b) {
        var c = a.type;
        switch ("string" === typeof c && c.toLowerCase()) {
            case "checkbox":
            case "radio":
                a.checked = b;
                break;
            case "select-one":
                a.selectedIndex = -1;
                if ("string" === typeof b) for (var d = 0; c = a.options[d]; d++) if (c.value == b) {
                    c.selected = !0;
                    break
                }
                break;
            case "select-multiple":
                "string" === typeof b && (b = [b]);
                for (d = 0; c = a.options[d]; d++) if (c.selected = !1, b) for (var e, f = 0; e = b[f]; f++) c.value == e && (c.selected = !0);
                break;
            default:
                a.value = null != b ? b : ""
        }
    };

    function le(a, b) {
        try {
            var c = "number" == typeof a.selectionStart
        } catch (d) {
            c = !1
        }
        c ? (a.selectionStart = b, a.selectionEnd = b) : A && !sc("9") && ("textarea" == a.type && (b = a.value.substring(0, b).replace(/(\r\n|\r|\n)/g, "\n").length), a = a.createTextRange(), a.collapse(!0), a.move("character", b), a.select())
    };var me = !A || 9 <= Number(tc), ne = A && !sc("9"), oe = function () {
        if (!q.addEventListener || !Object.defineProperty) return !1;
        var a = !1, b = Object.defineProperty({}, "passive", {
            get: function () {
                a = !0
            }
        });
        try {
            q.addEventListener("test", wa, b), q.removeEventListener("test", wa, b)
        } catch (c) {
        }
        return a
    }();

    function pe(a, b) {
        this.type = a;
        this.currentTarget = this.target = b;
        this.defaultPrevented = this.sb = !1;
        this.tf = !0
    }

    pe.prototype.stopPropagation = function () {
        this.sb = !0
    };
    pe.prototype.preventDefault = function () {
        this.defaultPrevented = !0;
        this.tf = !1
    };

    function qe(a, b) {
        pe.call(this, a ? a.type : "");
        this.relatedTarget = this.currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
        this.key = "";
        this.charCode = this.keyCode = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.state = null;
        this.pointerId = 0;
        this.pointerType = "";
        this.Ia = null;
        a && this.init(a, b)
    }

    x(qe, pe);
    var re = td({2: "touch", 3: "pen", 4: "mouse"});
    qe.prototype.init = function (a, b) {
        var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.currentTarget = b;
        if (b = a.relatedTarget) {
            if (ic) {
                a:{
                    try {
                        cc(b.nodeName);
                        var e = !0;
                        break a
                    } catch (f) {
                    }
                    e = !1
                }
                e || (b = null)
            }
        } else "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);
        this.relatedTarget = b;
        d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY =
            d.screenY || 0) : (this.offsetX = jc || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = jc || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
        this.button = a.button;
        this.keyCode = a.keyCode || 0;
        this.key = a.key || "";
        this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.pointerId =
            a.pointerId || 0;
        this.pointerType = "string" === typeof a.pointerType ? a.pointerType : re[a.pointerType] || "";
        this.state = a.state;
        this.Ia = a;
        a.defaultPrevented && this.preventDefault()
    };
    qe.prototype.stopPropagation = function () {
        qe.Z.stopPropagation.call(this);
        this.Ia.stopPropagation ? this.Ia.stopPropagation() : this.Ia.cancelBubble = !0
    };
    qe.prototype.preventDefault = function () {
        qe.Z.preventDefault.call(this);
        var a = this.Ia;
        if (a.preventDefault) a.preventDefault(); else if (a.returnValue = !1, ne) try {
            if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
        } catch (b) {
        }
    };
    var se = "closure_listenable_" + (1E6 * Math.random() | 0);

    function te(a) {
        return !(!a || !a[se])
    }

    var ue = 0;

    function ve(a, b, c, d, e) {
        this.listener = a;
        this.fd = null;
        this.src = b;
        this.type = c;
        this.capture = !!d;
        this.Rc = e;
        this.key = ++ue;
        this.Jb = this.Bc = !1
    }

    function we(a) {
        a.Jb = !0;
        a.listener = null;
        a.fd = null;
        a.src = null;
        a.Rc = null
    };

    function xe(a) {
        this.src = a;
        this.ba = {};
        this.vc = 0
    }

    h = xe.prototype;
    h.add = function (a, b, c, d, e) {
        var f = a.toString();
        a = this.ba[f];
        a || (a = this.ba[f] = [], this.vc++);
        var g = ye(a, b, d, e);
        -1 < g ? (b = a[g], c || (b.Bc = !1)) : (b = new ve(b, this.src, f, !!d, e), b.Bc = c, a.push(b));
        return b
    };
    h.remove = function (a, b, c, d) {
        a = a.toString();
        if (!(a in this.ba)) return !1;
        var e = this.ba[a];
        b = ye(e, b, c, d);
        return -1 < b ? (we(e[b]), Ta(e, b), 0 == e.length && (delete this.ba[a], this.vc--), !0) : !1
    };

    function ze(a, b) {
        var c = b.type;
        c in a.ba && Sa(a.ba[c], b) && (we(b), 0 == a.ba[c].length && (delete a.ba[c], a.vc--))
    }

    h.gd = function (a) {
        a = a && a.toString();
        var b = 0, c;
        for (c in this.ba) if (!a || c == a) {
            for (var d = this.ba[c], e = 0; e < d.length; e++) ++b, we(d[e]);
            delete this.ba[c];
            this.vc--
        }
    };
    h.ac = function (a, b, c, d) {
        a = this.ba[a.toString()];
        var e = -1;
        a && (e = ye(a, b, c, d));
        return -1 < e ? a[e] : null
    };
    h.hasListener = function (a, b) {
        var c = void 0 !== a, d = c ? a.toString() : "", e = void 0 !== b;
        return ob(this.ba, function (f) {
            for (var g = 0; g < f.length; ++g) if (!(c && f[g].type != d || e && f[g].capture != b)) return !0;
            return !1
        })
    };

    function ye(a, b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e];
            if (!f.Jb && f.listener == b && f.capture == !!c && f.Rc == d) return e
        }
        return -1
    };var Ae = "closure_lm_" + (1E6 * Math.random() | 0), Be = {}, Ce = 0;

    function De(a, b, c, d, e) {
        if (d && d.once) return Ee(a, b, c, d, e);
        if (za(b)) {
            for (var f = 0; f < b.length; f++) De(a, b[f], c, d, e);
            return null
        }
        c = Fe(c);
        return te(a) ? a.listen(b, c, r(d) ? !!d.capture : !!d, e) : Ge(a, b, c, !1, d, e)
    }

    function Ge(a, b, c, d, e, f) {
        if (!b) throw Error("Invalid event type");
        var g = r(e) ? !!e.capture : !!e, k = He(a);
        k || (a[Ae] = k = new xe(a));
        c = k.add(b, c, d, g, f);
        if (c.fd) return c;
        d = Ie();
        c.fd = d;
        d.src = a;
        d.listener = c;
        if (a.addEventListener) oe || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e); else if (a.attachEvent) a.attachEvent(Je(b.toString()), d); else if (a.addListener && a.removeListener) a.addListener(d); else throw Error("addEventListener and attachEvent are unavailable.");
        Ce++;
        return c
    }

    function Ie() {
        var a = Ke, b = me ? function (c) {
            return a.call(b.src, b.listener, c)
        } : function (c) {
            c = a.call(b.src, b.listener, c);
            if (!c) return c
        };
        return b
    }

    function Ee(a, b, c, d, e) {
        if (za(b)) {
            for (var f = 0; f < b.length; f++) Ee(a, b[f], c, d, e);
            return null
        }
        c = Fe(c);
        return te(a) ? a.bf(b, c, r(d) ? !!d.capture : !!d, e) : Ge(a, b, c, !0, d, e)
    }

    function Le(a, b, c, d, e) {
        if (za(b)) for (var f = 0; f < b.length; f++) Le(a, b[f], c, d, e); else d = r(d) ? !!d.capture : !!d, c = Fe(c), te(a) ? a.ke(b, c, d, e) : a && (a = He(a)) && (b = a.ac(b, c, d, e)) && Me(b)
    }

    function Me(a) {
        if ("number" !== typeof a && a && !a.Jb) {
            var b = a.src;
            if (te(b)) ze(b.Ha, a); else {
                var c = a.type, d = a.fd;
                b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Je(c), d) : b.addListener && b.removeListener && b.removeListener(d);
                Ce--;
                (c = He(b)) ? (ze(c, a), 0 == c.vc && (c.src = null, b[Ae] = null)) : we(a)
            }
        }
    }

    function Je(a) {
        return a in Be ? Be[a] : Be[a] = "on" + a
    }

    function Ne(a, b, c, d) {
        var e = !0;
        if (a = He(a)) if (b = a.ba[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
            var f = b[a];
            f && f.capture == c && !f.Jb && (f = Oe(f, d), e = e && !1 !== f)
        }
        return e
    }

    function Oe(a, b) {
        var c = a.listener, d = a.Rc || a.src;
        a.Bc && Me(a);
        return c.call(d, b)
    }

    function Ke(a, b) {
        if (a.Jb) return !0;
        if (!me) {
            if (!b) a:{
                b = ["window", "event"];
                for (var c = q, d = 0; d < b.length; d++) if (c = c[b[d]], null == c) {
                    b = null;
                    break a
                }
                b = c
            }
            d = b;
            b = new qe(d, this);
            c = !0;
            if (!(0 > d.keyCode || void 0 != d.returnValue)) {
                a:{
                    var e = !1;
                    if (0 == d.keyCode) try {
                        d.keyCode = -1;
                        break a
                    } catch (g) {
                        e = !0
                    }
                    if (e || void 0 == d.returnValue) d.returnValue = !0
                }
                d = [];
                for (e = b.currentTarget; e; e = e.parentNode) d.push(e);
                a = a.type;
                for (e = d.length - 1; !b.sb && 0 <= e; e--) {
                    b.currentTarget = d[e];
                    var f = Ne(d[e], a, !0, b);
                    c = c && f
                }
                for (e = 0; !b.sb && e < d.length; e++) b.currentTarget =
                    d[e], f = Ne(d[e], a, !1, b), c = c && f
            }
            return c
        }
        return Oe(a, new qe(b, this))
    }

    function He(a) {
        a = a[Ae];
        return a instanceof xe ? a : null
    }

    var Pe = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);

    function Fe(a) {
        if (Ba(a)) return a;
        a[Pe] || (a[Pe] = function (b) {
            return a.handleEvent(b)
        });
        return a[Pe]
    };

    function Qe() {
        Rd.call(this);
        this.Ha = new xe(this);
        this.ig = this;
        this.bd = null
    }

    x(Qe, Rd);
    Qe.prototype[se] = !0;
    h = Qe.prototype;
    h.fe = function (a) {
        this.bd = a
    };
    h.addEventListener = function (a, b, c, d) {
        De(this, a, b, c, d)
    };
    h.removeEventListener = function (a, b, c, d) {
        Le(this, a, b, c, d)
    };
    h.dispatchEvent = function (a) {
        var b, c = this.bd;
        if (c) for (b = []; c; c = c.bd) b.push(c);
        c = this.ig;
        var d = a.type || a;
        if ("string" === typeof a) a = new pe(a, c); else if (a instanceof pe) a.target = a.target || c; else {
            var e = a;
            a = new pe(d, c);
            rb(a, e)
        }
        e = !0;
        if (b) for (var f = b.length - 1; !a.sb && 0 <= f; f--) {
            var g = a.currentTarget = b[f];
            e = Re(g, d, !0, a) && e
        }
        a.sb || (g = a.currentTarget = c, e = Re(g, d, !0, a) && e, a.sb || (e = Re(g, d, !1, a) && e));
        if (b) for (f = 0; !a.sb && f < b.length; f++) g = a.currentTarget = b[f], e = Re(g, d, !1, a) && e;
        return e
    };
    h.h = function () {
        Qe.Z.h.call(this);
        this.Ha && this.Ha.gd(void 0);
        this.bd = null
    };
    h.listen = function (a, b, c, d) {
        return this.Ha.add(String(a), b, !1, c, d)
    };
    h.bf = function (a, b, c, d) {
        return this.Ha.add(String(a), b, !0, c, d)
    };
    h.ke = function (a, b, c, d) {
        this.Ha.remove(String(a), b, c, d)
    };

    function Re(a, b, c, d) {
        b = a.Ha.ba[String(b)];
        if (!b) return !0;
        b = b.concat();
        for (var e = !0, f = 0; f < b.length; ++f) {
            var g = b[f];
            if (g && !g.Jb && g.capture == c) {
                var k = g.listener, l = g.Rc || g.src;
                g.Bc && ze(a.Ha, g);
                e = !1 !== k.call(l, d) && e
            }
        }
        return e && 0 != d.tf
    }

    h.ac = function (a, b, c, d) {
        return this.Ha.ac(String(a), b, c, d)
    };
    h.hasListener = function (a, b) {
        return this.Ha.hasListener(void 0 !== a ? String(a) : void 0, b)
    };

    function Se(a) {
        if (a.altKey && !a.ctrlKey || a.metaKey || 112 <= a.keyCode && 123 >= a.keyCode) return !1;
        if (Te(a.keyCode)) return !0;
        switch (a.keyCode) {
            case 18:
            case 20:
            case 93:
            case 17:
            case 40:
            case 35:
            case 27:
            case 36:
            case 45:
            case 37:
            case 224:
            case 91:
            case 144:
            case 12:
            case 34:
            case 33:
            case 19:
            case 255:
            case 44:
            case 39:
            case 145:
            case 16:
            case 38:
            case 252:
            case 224:
            case 92:
                return !1;
            case 0:
                return !ic;
            default:
                return 166 > a.keyCode || 183 < a.keyCode
        }
    }

    function Ue(a, b, c, d, e, f) {
        if (jc && !sc("525")) return !0;
        if (lc && e) return Te(a);
        if (e && !d) return !1;
        if (!ic) {
            "number" === typeof b && (b = Ve(b));
            var g = 17 == b || 18 == b || lc && 91 == b;
            if ((!c || lc) && g || lc && 16 == b && (d || f)) return !1
        }
        if ((jc || gc) && d && c) switch (a) {
            case 220:
            case 219:
            case 221:
            case 192:
            case 186:
            case 189:
            case 187:
            case 188:
            case 190:
            case 191:
            case 192:
            case 222:
                return !1
        }
        if (A && d && b == a) return !1;
        switch (a) {
            case 13:
                return ic ? f || e ? !1 : !(c && d) : !0;
            case 27:
                return !(jc || gc || ic)
        }
        return ic && (d || e || f) ? !1 : Te(a)
    }

    function Te(a) {
        if (48 <= a && 57 >= a || 96 <= a && 106 >= a || 65 <= a && 90 >= a || (jc || gc) && 0 == a) return !0;
        switch (a) {
            case 32:
            case 43:
            case 63:
            case 64:
            case 107:
            case 109:
            case 110:
            case 111:
            case 186:
            case 59:
            case 189:
            case 187:
            case 61:
            case 188:
            case 190:
            case 191:
            case 192:
            case 222:
            case 219:
            case 220:
            case 221:
            case 163:
            case 58:
                return !0;
            case 173:
                return ic;
            default:
                return !1
        }
    }

    function Ve(a) {
        if (ic) a = We(a); else if (lc && jc) switch (a) {
            case 93:
                a = 91
        }
        return a
    }

    function We(a) {
        switch (a) {
            case 61:
                return 187;
            case 59:
                return 186;
            case 173:
                return 189;
            case 224:
                return 91;
            case 0:
                return 224;
            default:
                return a
        }
    };

    function Xe(a) {
        Qe.call(this);
        this.f = a;
        De(a, "keydown", this.Oc, !1, this);
        De(a, "click", this.Ve, !1, this)
    }

    x(Xe, Qe);
    Xe.prototype.Oc = function (a) {
        (13 == a.keyCode || jc && 3 == a.keyCode) && Ye(this, a)
    };
    Xe.prototype.Ve = function (a) {
        Ye(this, a)
    };

    function Ye(a, b) {
        var c = new $e(b);
        if (a.dispatchEvent(c)) {
            c = new af(b);
            try {
                a.dispatchEvent(c)
            } finally {
                b.stopPropagation()
            }
        }
    }

    Xe.prototype.h = function () {
        Xe.Z.h.call(this);
        Le(this.f, "keydown", this.Oc, !1, this);
        Le(this.f, "click", this.Ve, !1, this);
        delete this.f
    };

    function af(a) {
        qe.call(this, a.Ia);
        this.type = "action"
    }

    x(af, qe);

    function $e(a) {
        qe.call(this, a.Ia);
        this.type = "beforeaction"
    }

    x($e, qe);

    function bf(a) {
        Rd.call(this);
        this.Od = a;
        this.J = {}
    }

    x(bf, Rd);
    var cf = [];
    h = bf.prototype;
    h.listen = function (a, b, c, d) {
        za(b) || (b && (cf[0] = b.toString()), b = cf);
        for (var e = 0; e < b.length; e++) {
            var f = De(a, b[e], c || this.handleEvent, d || !1, this.Od || this);
            if (!f) break;
            this.J[f.key] = f
        }
        return this
    };
    h.bf = function (a, b, c, d) {
        return df(this, a, b, c, d)
    };

    function df(a, b, c, d, e, f) {
        if (za(c)) for (var g = 0; g < c.length; g++) df(a, b, c[g], d, e, f); else {
            b = Ee(b, c, d || a.handleEvent, e, f || a.Od || a);
            if (!b) return a;
            a.J[b.key] = b
        }
        return a
    }

    h.ke = function (a, b, c, d, e) {
        if (za(b)) for (var f = 0; f < b.length; f++) this.ke(a, b[f], c, d, e); else c = c || this.handleEvent, d = r(d) ? !!d.capture : !!d, e = e || this.Od || this, c = Fe(c), d = !!d, b = te(a) ? a.ac(b, c, d, e) : a ? (a = He(a)) ? a.ac(b, c, d, e) : null : null, b && (Me(b), delete this.J[b.key])
    };
    h.gd = function () {
        nb(this.J, function (a, b) {
            this.J.hasOwnProperty(b) && Me(a)
        }, this);
        this.J = {}
    };
    h.h = function () {
        bf.Z.h.call(this);
        this.gd()
    };
    h.handleEvent = function () {
        throw Error("EventHandler.handleEvent not implemented");
    };

    function ef(a) {
        Qe.call(this);
        this.f = a;
        a = A ? "focusout" : "blur";
        this.fh = De(this.f, A ? "focusin" : "focus", this, !A);
        this.gh = De(this.f, a, this, !A)
    }

    x(ef, Qe);
    ef.prototype.handleEvent = function (a) {
        var b = new qe(a.Ia);
        b.type = "focusin" == a.type || "focus" == a.type ? "focusin" : "focusout";
        this.dispatchEvent(b)
    };
    ef.prototype.h = function () {
        ef.Z.h.call(this);
        Me(this.fh);
        Me(this.gh);
        delete this.f
    };

    function ff(a) {
        if (!a) return !1;
        try {
            return !!a.$goog_Thenable
        } catch (b) {
            return !1
        }
    };

    function B(a) {
        this.B = 0;
        this.na = void 0;
        this.xb = this.Xa = this.F = null;
        this.Mc = this.Fd = !1;
        if (a != wa) try {
            var b = this;
            a.call(void 0, function (c) {
                gf(b, 2, c)
            }, function (c) {
                if (!(c instanceof hf)) try {
                    if (c instanceof Error) throw c;
                    throw Error("Promise rejected.");
                } catch (d) {
                }
                gf(b, 3, c)
            })
        } catch (c) {
            gf(this, 3, c)
        }
    }

    function jf() {
        this.next = this.context = this.Gb = this.mc = this.child = null;
        this.Tb = !1
    }

    jf.prototype.reset = function () {
        this.context = this.Gb = this.mc = this.child = null;
        this.Tb = !1
    };
    var kf = new $a(function () {
        return new jf
    }, function (a) {
        a.reset()
    });

    function lf(a, b, c) {
        var d = kf.get();
        d.mc = a;
        d.Gb = b;
        d.context = c;
        return d
    }

    function C(a) {
        if (a instanceof B) return a;
        var b = new B(wa);
        gf(b, 2, a);
        return b
    }

    function mf(a) {
        return new B(function (b, c) {
            c(a)
        })
    }

    B.prototype.then = function (a, b, c) {
        return nf(this, Ba(a) ? a : null, Ba(b) ? b : null, c)
    };
    B.prototype.$goog_Thenable = !0;
    h = B.prototype;
    h.Wh = function (a, b) {
        a = lf(a, a, b);
        a.Tb = !0;
        of(this, a);
        return this
    };
    h.Nb = function (a, b) {
        return nf(this, null, a, b)
    };
    h.cancel = function (a) {
        if (0 == this.B) {
            var b = new hf(a);
            Uc(function () {
                pf(this, b)
            }, this)
        }
    };

    function pf(a, b) {
        if (0 == a.B) if (a.F) {
            var c = a.F;
            if (c.Xa) {
                for (var d = 0, e = null, f = null, g = c.Xa; g && (g.Tb || (d++, g.child == a && (e = g), !(e && 1 < d))); g = g.next) e || (f = g);
                e && (0 == c.B && 1 == d ? pf(c, b) : (f ? (d = f, d.next == c.xb && (c.xb = d), d.next = d.next.next) : qf(c), rf(c, e, 3, b)))
            }
            a.F = null
        } else gf(a, 3, b)
    }

    function of(a, b) {
        a.Xa || 2 != a.B && 3 != a.B || sf(a);
        a.xb ? a.xb.next = b : a.Xa = b;
        a.xb = b
    }

    function nf(a, b, c, d) {
        var e = lf(null, null, null);
        e.child = new B(function (f, g) {
            e.mc = b ? function (k) {
                try {
                    var l = b.call(d, k);
                    f(l)
                } catch (n) {
                    g(n)
                }
            } : f;
            e.Gb = c ? function (k) {
                try {
                    var l = c.call(d, k);
                    void 0 === l && k instanceof hf ? g(k) : f(l)
                } catch (n) {
                    g(n)
                }
            } : g
        });
        e.child.F = a;
        of(a, e);
        return e.child
    }

    h.Zh = function (a) {
        this.B = 0;
        gf(this, 2, a)
    };
    h.$h = function (a) {
        this.B = 0;
        gf(this, 3, a)
    };

    function gf(a, b, c) {
        if (0 == a.B) {
            a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
            a.B = 1;
            a:{
                var d = c, e = a.Zh, f = a.$h;
                if (d instanceof B) {
                    of(d, lf(e || wa, f || null, a));
                    var g = !0
                } else if (ff(d)) d.then(e, f, a), g = !0; else {
                    if (r(d)) try {
                        var k = d.then;
                        if (Ba(k)) {
                            tf(d, k, e, f, a);
                            g = !0;
                            break a
                        }
                    } catch (l) {
                        f.call(a, l);
                        g = !0;
                        break a
                    }
                    g = !1
                }
            }
            g || (a.na = c, a.B = b, a.F = null, sf(a), 3 != b || c instanceof hf || uf(a, c))
        }
    }

    function tf(a, b, c, d, e) {
        function f(l) {
            k || (k = !0, d.call(e, l))
        }

        function g(l) {
            k || (k = !0, c.call(e, l))
        }

        var k = !1;
        try {
            b.call(a, g, f)
        } catch (l) {
            f(l)
        }
    }

    function sf(a) {
        a.Fd || (a.Fd = !0, Uc(a.Kg, a))
    }

    function qf(a) {
        var b = null;
        a.Xa && (b = a.Xa, a.Xa = b.next, b.next = null);
        a.Xa || (a.xb = null);
        return b
    }

    h.Kg = function () {
        for (var a; a = qf(this);) rf(this, a, this.B, this.na);
        this.Fd = !1
    };

    function rf(a, b, c, d) {
        if (3 == c && b.Gb && !b.Tb) for (; a && a.Mc; a = a.F) a.Mc = !1;
        if (b.child) b.child.F = null, vf(b, c, d); else try {
            b.Tb ? b.mc.call(b.context) : vf(b, c, d)
        } catch (e) {
            wf.call(null, e)
        }
        kf.put(b)
    }

    function vf(a, b, c) {
        2 == b ? a.mc.call(a.context, c) : a.Gb && a.Gb.call(a.context, c)
    }

    function uf(a, b) {
        a.Mc = !0;
        Uc(function () {
            a.Mc && wf.call(null, b)
        })
    }

    var wf = Oc;

    function hf(a) {
        Ga.call(this, a)
    }

    x(hf, Ga);
    hf.prototype.name = "cancel";

    function xf(a, b) {
        Qe.call(this);
        this.Vc = a || 1;
        this.uc = b || q;
        this.Ae = t(this.Yh, this);
        this.af = Fa()
    }

    x(xf, Qe);
    h = xf.prototype;
    h.enabled = !1;
    h.$ = null;
    h.setInterval = function (a) {
        this.Vc = a;
        this.$ && this.enabled ? (this.stop(), this.start()) : this.$ && this.stop()
    };
    h.Yh = function () {
        if (this.enabled) {
            var a = Fa() - this.af;
            0 < a && a < .8 * this.Vc ? this.$ = this.uc.setTimeout(this.Ae, this.Vc - a) : (this.$ && (this.uc.clearTimeout(this.$), this.$ = null), this.dispatchEvent("tick"), this.enabled && (this.stop(), this.start()))
        }
    };
    h.start = function () {
        this.enabled = !0;
        this.$ || (this.$ = this.uc.setTimeout(this.Ae, this.Vc), this.af = Fa())
    };
    h.stop = function () {
        this.enabled = !1;
        this.$ && (this.uc.clearTimeout(this.$), this.$ = null)
    };
    h.h = function () {
        xf.Z.h.call(this);
        this.stop();
        delete this.uc
    };

    function yf(a, b) {
        if (Ba(a)) b && (a = t(a, b)); else if (a && "function" == typeof a.handleEvent) a = t(a.handleEvent, a); else throw Error("Invalid listener argument");
        return 2147483647 < Number(0) ? -1 : q.setTimeout(a, 0)
    };

    function zf(a) {
        Qe.call(this);
        this.$ = null;
        this.f = a;
        a = A || gc || jc && !sc("531") && "TEXTAREA" == a.tagName;
        this.Oe = new bf(this);
        this.Oe.listen(this.f, a ? ["keydown", "paste", "cut", "drop", "input"] : "input", this)
    }

    x(zf, Qe);
    zf.prototype.handleEvent = function (a) {
        if ("input" == a.type) A && sc(10) && 0 == a.keyCode && 0 == a.charCode || (Af(this), this.dispatchEvent(Bf(a))); else if ("keydown" != a.type || Se(a)) {
            var b = "keydown" == a.type ? this.f.value : null;
            A && 229 == a.keyCode && (b = null);
            var c = Bf(a);
            Af(this);
            this.$ = yf(function () {
                this.$ = null;
                this.f.value != b && this.dispatchEvent(c)
            }, this)
        }
    };

    function Af(a) {
        null != a.$ && (q.clearTimeout(a.$), a.$ = null)
    }

    function Bf(a) {
        a = new qe(a.Ia);
        a.type = "input";
        return a
    }

    zf.prototype.h = function () {
        zf.Z.h.call(this);
        this.Oe.i();
        Af(this);
        delete this.f
    };

    function Cf(a, b) {
        Qe.call(this);
        a && (this.Xc && this.detach(), this.f = a, this.Wc = De(this.f, "keypress", this, b), this.Td = De(this.f, "keydown", this.Oc, b, this), this.Xc = De(this.f, "keyup", this.Ug, b, this))
    }

    x(Cf, Qe);
    h = Cf.prototype;
    h.f = null;
    h.Wc = null;
    h.Td = null;
    h.Xc = null;
    h.ia = -1;
    h.Na = -1;
    h.vd = !1;
    var Df = {
        3: 13,
        12: 144,
        63232: 38,
        63233: 40,
        63234: 37,
        63235: 39,
        63236: 112,
        63237: 113,
        63238: 114,
        63239: 115,
        63240: 116,
        63241: 117,
        63242: 118,
        63243: 119,
        63244: 120,
        63245: 121,
        63246: 122,
        63247: 123,
        63248: 44,
        63272: 46,
        63273: 36,
        63275: 35,
        63276: 33,
        63277: 34,
        63289: 144,
        63302: 45
    }, Ef = {
        Up: 38,
        Down: 40,
        Left: 37,
        Right: 39,
        Enter: 13,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        "U+007F": 46,
        Home: 36,
        End: 35,
        PageUp: 33,
        PageDown: 34,
        Insert: 45
    }, Ff = !jc || sc("525"), Gf = lc && ic;
    h = Cf.prototype;
    h.Oc = function (a) {
        if (jc || gc) if (17 == this.ia && !a.ctrlKey || 18 == this.ia && !a.altKey || lc && 91 == this.ia && !a.metaKey) this.Na = this.ia = -1;
        -1 == this.ia && (a.ctrlKey && 17 != a.keyCode ? this.ia = 17 : a.altKey && 18 != a.keyCode ? this.ia = 18 : a.metaKey && 91 != a.keyCode && (this.ia = 91));
        Ff && !Ue(a.keyCode, this.ia, a.shiftKey, a.ctrlKey, a.altKey, a.metaKey) ? this.handleEvent(a) : (this.Na = Ve(a.keyCode), Gf && (this.vd = a.altKey))
    };
    h.Ug = function (a) {
        this.Na = this.ia = -1;
        this.vd = a.altKey
    };
    h.handleEvent = function (a) {
        var b = a.Ia, c = b.altKey;
        if (A && "keypress" == a.type) {
            var d = this.Na;
            var e = 13 != d && 27 != d ? b.keyCode : 0
        } else (jc || gc) && "keypress" == a.type ? (d = this.Na, e = 0 <= b.charCode && 63232 > b.charCode && Te(d) ? b.charCode : 0) : fc && !jc ? (d = this.Na, e = Te(d) ? b.keyCode : 0) : ("keypress" == a.type ? (Gf && (c = this.vd), b.keyCode == b.charCode ? 32 > b.keyCode ? (d = b.keyCode, e = 0) : (d = this.Na, e = b.charCode) : (d = b.keyCode || this.Na, e = b.charCode || 0)) : (d = b.keyCode || this.Na, e = b.charCode || 0), lc && 63 == e && 224 == d && (d = 191));
        var f = d = Ve(d);
        d ? 63232 <=
        d && d in Df ? f = Df[d] : 25 == d && a.shiftKey && (f = 9) : b.keyIdentifier && b.keyIdentifier in Ef && (f = Ef[b.keyIdentifier]);
        ic && Ff && "keypress" == a.type && !Ue(f, this.ia, a.shiftKey, a.ctrlKey, c, a.metaKey) || (a = f == this.ia, this.ia = f, b = new Hf(f, e, a, b), b.altKey = c, this.dispatchEvent(b))
    };
    h.fa = function () {
        return this.f
    };
    h.detach = function () {
        this.Wc && (Me(this.Wc), Me(this.Td), Me(this.Xc), this.Xc = this.Td = this.Wc = null);
        this.f = null;
        this.Na = this.ia = -1
    };
    h.h = function () {
        Cf.Z.h.call(this);
        this.detach()
    };

    function Hf(a, b, c, d) {
        qe.call(this, d);
        this.type = "key";
        this.keyCode = a;
        this.charCode = b;
        this.repeat = c
    }

    x(Hf, qe);
    var If = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;

    function Jf(a) {
        var b = [];
        Kf(new Lf, a, b);
        return b.join("")
    }

    function Lf() {
        this.kd = void 0
    }

    function Kf(a, b, c) {
        if (null == b) c.push("null"); else {
            if ("object" == typeof b) {
                if (za(b)) {
                    var d = b;
                    b = d.length;
                    c.push("[");
                    for (var e = "", f = 0; f < b; f++) c.push(e), e = d[f], Kf(a, a.kd ? a.kd.call(d, String(f), e) : e, c), e = ",";
                    c.push("]");
                    return
                }
                if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf(); else {
                    c.push("{");
                    f = "";
                    for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (e = b[d], "function" != typeof e && (c.push(f), Mf(d, c), c.push(":"), Kf(a, a.kd ? a.kd.call(b, d, e) : e, c), f = ","));
                    c.push("}");
                    return
                }
            }
            switch (typeof b) {
                case "string":
                    Mf(b,
                        c);
                    break;
                case "number":
                    c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");
                    break;
                case "boolean":
                    c.push(String(b));
                    break;
                case "function":
                    c.push("null");
                    break;
                default:
                    throw Error("Unknown type: " + typeof b);
            }
        }
    }

    var Nf = {
        '"': '\\"',
        "\\": "\\\\",
        "/": "\\/",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\u000b"
    }, Of = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;

    function Mf(a, b) {
        b.push('"', a.replace(Of, function (c) {
            var d = Nf[c];
            d || (d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).substr(1), Nf[c] = d);
            return d
        }), '"')
    };

    function Pf(a, b) {
        var c = Qf;
        c && c.log(yd, a, b)
    };

    function Rf(a, b, c, d) {
        this.top = a;
        this.right = b;
        this.bottom = c;
        this.left = d
    }

    h = Rf.prototype;
    h.clone = function () {
        return new Rf(this.top, this.right, this.bottom, this.left)
    };
    h.toString = function () {
        return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
    };
    h.contains = function (a) {
        return this && a ? a instanceof Rf ? a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom : a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom : !1
    };
    h.expand = function (a, b, c, d) {
        r(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += Number(b), this.bottom += Number(c), this.left -= Number(d));
        return this
    };
    h.ceil = function () {
        this.top = Math.ceil(this.top);
        this.right = Math.ceil(this.right);
        this.bottom = Math.ceil(this.bottom);
        this.left = Math.ceil(this.left);
        return this
    };
    h.floor = function () {
        this.top = Math.floor(this.top);
        this.right = Math.floor(this.right);
        this.bottom = Math.floor(this.bottom);
        this.left = Math.floor(this.left);
        return this
    };
    h.round = function () {
        this.top = Math.round(this.top);
        this.right = Math.round(this.right);
        this.bottom = Math.round(this.bottom);
        this.left = Math.round(this.left);
        return this
    };
    h.translate = function (a, b) {
        a instanceof wc ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, "number" === typeof b && (this.top += b, this.bottom += b));
        return this
    };
    h.scale = function (a, b) {
        b = "number" === typeof b ? b : a;
        this.left *= a;
        this.right *= a;
        this.top *= b;
        this.bottom *= b;
        return this
    };

    function Sf() {
        this.ea = ("undefined" == typeof document ? null : document) || {cookie: ""}
    }

    h = Sf.prototype;
    h.isEnabled = function () {
        return navigator.cookieEnabled
    };
    h.set = function (a, b, c, d, e, f) {
        if ("object" === typeof c) {
            var g = c.Bi;
            f = c.Gi;
            e = c.domain;
            d = c.path;
            c = c.Ai
        }
        if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
        if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
        void 0 === c && (c = -1);
        e = e ? ";domain=" + e : "";
        d = d ? ";path=" + d : "";
        f = f ? ";secure" : "";
        c = 0 > c ? "" : 0 == c ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Fa() + 1E3 * c)).toUTCString();
        this.ea.cookie = a + "=" + b + e + d + c + f + (null != g ? ";samesite=" + g : "")
    };
    h.get = function (a, b) {
        for (var c = a + "=", d = (this.ea.cookie || "").split(";"), e = 0, f; e < d.length; e++) {
            f = ab(d[e]);
            if (0 == f.lastIndexOf(c, 0)) return f.substr(c.length);
            if (f == a) return ""
        }
        return b
    };
    h.remove = function (a, b, c) {
        var d = this.Ya(a);
        this.set(a, "", 0, b, c);
        return d
    };
    h.Ja = function () {
        return Tf(this).keys
    };
    h.qa = function () {
        return Tf(this).values
    };
    h.hc = function () {
        return !this.ea.cookie
    };
    h.Ya = function (a) {
        return void 0 !== this.get(a)
    };
    h.clear = function () {
        for (var a = Tf(this).keys, b = a.length - 1; 0 <= b; b--) this.remove(a[b])
    };

    function Tf(a) {
        a = (a.ea.cookie || "").split(";");
        for (var b = [], c = [], d, e, f = 0; f < a.length; f++) e = ab(a[f]), d = e.indexOf("="), -1 == d ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
        return {keys: b, values: c}
    }

    var Uf = new Sf;/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
    function Vf(a) {
        var b = Wf;
        this.ld = [];
        this.ef = b;
        this.Ge = a || null;
        this.dc = this.Ab = !1;
        this.na = void 0;
        this.he = this.ng = this.wd = !1;
        this.nd = 0;
        this.F = null;
        this.xd = 0
    }

    Vf.prototype.cancel = function (a) {
        if (this.Ab) this.na instanceof Vf && this.na.cancel(); else {
            if (this.F) {
                var b = this.F;
                delete this.F;
                a ? b.cancel(a) : (b.xd--, 0 >= b.xd && b.cancel())
            }
            this.ef ? this.ef.call(this.Ge, this) : this.he = !0;
            this.Ab || (a = new Xf(this), Yf(this), Zf(this, !1, a))
        }
    };
    Vf.prototype.Ee = function (a, b) {
        this.wd = !1;
        Zf(this, a, b)
    };

    function Zf(a, b, c) {
        a.Ab = !0;
        a.na = c;
        a.dc = !b;
        $f(a)
    }

    function Yf(a) {
        if (a.Ab) {
            if (!a.he) throw new ag(a);
            a.he = !1
        }
    }

    Vf.prototype.callback = function (a) {
        Yf(this);
        Zf(this, !0, a)
    };

    function bg(a, b, c) {
        a.ld.push([b, c, void 0]);
        a.Ab && $f(a)
    }

    Vf.prototype.then = function (a, b, c) {
        var d, e, f = new B(function (g, k) {
            d = g;
            e = k
        });
        bg(this, d, function (g) {
            g instanceof Xf ? f.cancel() : e(g)
        });
        return f.then(a, b, c)
    };
    Vf.prototype.$goog_Thenable = !0;

    function cg(a) {
        return Pa(a.ld, function (b) {
            return Ba(b[1])
        })
    }

    function $f(a) {
        if (a.nd && a.Ab && cg(a)) {
            var b = a.nd, c = dg[b];
            c && (q.clearTimeout(c.lb), delete dg[b]);
            a.nd = 0
        }
        a.F && (a.F.xd--, delete a.F);
        b = a.na;
        for (var d = c = !1; a.ld.length && !a.wd;) {
            var e = a.ld.shift(), f = e[0], g = e[1];
            e = e[2];
            if (f = a.dc ? g : f) try {
                var k = f.call(e || a.Ge, b);
                void 0 !== k && (a.dc = a.dc && (k == b || k instanceof Error), a.na = b = k);
                if (ff(b) || "function" === typeof q.Promise && b instanceof q.Promise) d = !0, a.wd = !0
            } catch (l) {
                b = l, a.dc = !0, cg(a) || (c = !0)
            }
        }
        a.na = b;
        d && (k = t(a.Ee, a, !0), d = t(a.Ee, a, !1), b instanceof Vf ? (bg(b, k, d), b.ng =
            !0) : b.then(k, d));
        c && (b = new eg(b), dg[b.lb] = b, a.nd = b.lb)
    }

    function ag() {
        Ga.call(this)
    }

    x(ag, Ga);
    ag.prototype.message = "Deferred has already fired";
    ag.prototype.name = "AlreadyCalledError";

    function Xf() {
        Ga.call(this)
    }

    x(Xf, Ga);
    Xf.prototype.message = "Deferred was canceled";
    Xf.prototype.name = "CanceledError";

    function eg(a) {
        this.lb = q.setTimeout(t(this.Xh, this), 0);
        this.Ig = a
    }

    eg.prototype.Xh = function () {
        delete dg[this.lb];
        throw this.Ig;
    };
    var dg = {};

    function fg(a) {
        var b = {}, c = b.document || document, d = Fb(a).toString(), e = Jc(document, "SCRIPT"),
            f = {uf: e, Ef: void 0}, g = new Vf(f), k = null, l = null != b.timeout ? b.timeout : 5E3;
        0 < l && (k = window.setTimeout(function () {
            gg(e, !0);
            var n = new hg(1, "Timeout reached for loading script " + d);
            Yf(g);
            Zf(g, !1, n)
        }, l), f.Ef = k);
        e.onload = e.onreadystatechange = function () {
            e.readyState && "loaded" != e.readyState && "complete" != e.readyState || (gg(e, b.ri || !1, k), g.callback(null))
        };
        e.onerror = function () {
            gg(e, !0, k);
            var n = new hg(0, "Error while loading script " +
                d);
            Yf(g);
            Zf(g, !1, n)
        };
        f = b.attributes || {};
        rb(f, {type: "text/javascript", charset: "UTF-8"});
        Ec(e, f);
        $b(e, a);
        ig(c).appendChild(e);
        return g
    }

    function ig(a) {
        var b = (a || document).getElementsByTagName("HEAD");
        return b && 0 != b.length ? b[0] : a.documentElement
    }

    function Wf() {
        if (this && this.uf) {
            var a = this.uf;
            a && "SCRIPT" == a.tagName && gg(a, !0, this.Ef)
        }
    }

    function gg(a, b, c) {
        null != c && q.clearTimeout(c);
        a.onload = wa;
        a.onerror = wa;
        a.onreadystatechange = wa;
        b && window.setTimeout(function () {
            Kc(a)
        }, 0)
    }

    function hg(a, b) {
        var c = "Jsloader error (code #" + a + ")";
        b && (c += ": " + b);
        Ga.call(this, c);
        this.code = a
    }

    x(hg, Ga);

    function jg(a) {
        if (a.qa && "function" == typeof a.qa) return a.qa();
        if ("string" === typeof a) return a.split("");
        if (Aa(a)) {
            for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
            return b
        }
        b = [];
        c = 0;
        for (d in a) b[c++] = a[d];
        return b
    }

    function kg(a) {
        if (a.Ja && "function" == typeof a.Ja) return a.Ja();
        if (!a.qa || "function" != typeof a.qa) {
            if (Aa(a) || "string" === typeof a) {
                var b = [];
                a = a.length;
                for (var c = 0; c < a; c++) b.push(c);
                return b
            }
            b = [];
            c = 0;
            for (var d in a) b[c++] = d;
            return b
        }
    }

    function lg(a, b, c) {
        if (a.forEach && "function" == typeof a.forEach) a.forEach(b, c); else if (Aa(a) || "string" === typeof a) La(a, b, c); else for (var d = kg(a), e = jg(a), f = e.length, g = 0; g < f; g++) b.call(c, e[g], d && d[g], a)
    };var mg = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;

    function ng(a, b) {
        if (a) {
            a = a.split("&");
            for (var c = 0; c < a.length; c++) {
                var d = a[c].indexOf("="), e = null;
                if (0 <= d) {
                    var f = a[c].substring(0, d);
                    e = a[c].substring(d + 1)
                } else f = a[c];
                b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
            }
        }
    }

    function og(a, b, c, d) {
        for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
            var f = a.charCodeAt(b - 1);
            if (38 == f || 63 == f) if (f = a.charCodeAt(b + e), !f || 61 == f || 38 == f || 35 == f) return b;
            b += e + 1
        }
        return -1
    }

    var pg = /#|$/;

    function qg(a, b) {
        var c = a.search(pg), d = og(a, 0, b, c);
        if (0 > d) return null;
        var e = a.indexOf("&", d);
        if (0 > e || e > c) e = c;
        d += b.length + 1;
        return decodeURIComponent(a.substr(d, e - d).replace(/\+/g, " "))
    }

    var rg = /[?&]($|#)/;

    function sg(a, b) {
        this.pa = this.vb = this.eb = "";
        this.Ib = null;
        this.hb = this.la = "";
        this.ra = this.dh = !1;
        if (a instanceof sg) {
            this.ra = void 0 !== b ? b : a.ra;
            tg(this, a.eb);
            var c = a.vb;
            ug(this);
            this.vb = c;
            c = a.pa;
            ug(this);
            this.pa = c;
            vg(this, a.Ib);
            c = a.la;
            ug(this);
            this.la = c;
            wg(this, a.V.clone());
            a = a.hb;
            ug(this);
            this.hb = a
        } else a && (c = String(a).match(mg)) ? (this.ra = !!b, tg(this, c[1] || "", !0), a = c[2] || "", ug(this), this.vb = xg(a), a = c[3] || "", ug(this), this.pa = xg(a, !0), vg(this, c[4]), a = c[5] || "", ug(this), this.la = xg(a, !0), wg(this, c[6] || "",
            !0), a = c[7] || "", ug(this), this.hb = xg(a)) : (this.ra = !!b, this.V = new yg(null, this.ra))
    }

    h = sg.prototype;
    h.toString = function () {
        var a = [], b = this.eb;
        b && a.push(zg(b, Ag, !0), ":");
        var c = this.pa;
        if (c || "file" == b) a.push("//"), (b = this.vb) && a.push(zg(b, Ag, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.Ib, null != c && a.push(":", String(c));
        if (c = this.la) this.pa && "/" != c.charAt(0) && a.push("/"), a.push(zg(c, "/" == c.charAt(0) ? Bg : Cg, !0));
        (c = this.V.toString()) && a.push("?", c);
        (c = this.hb) && a.push("#", zg(c, Dg));
        return a.join("")
    };
    h.resolve = function (a) {
        var b = this.clone(), c = !!a.eb;
        c ? tg(b, a.eb) : c = !!a.vb;
        if (c) {
            var d = a.vb;
            ug(b);
            b.vb = d
        } else c = !!a.pa;
        c ? (d = a.pa, ug(b), b.pa = d) : c = null != a.Ib;
        d = a.la;
        if (c) vg(b, a.Ib); else if (c = !!a.la) {
            if ("/" != d.charAt(0)) if (this.pa && !this.la) d = "/" + d; else {
                var e = b.la.lastIndexOf("/");
                -1 != e && (d = b.la.substr(0, e + 1) + d)
            }
            e = d;
            if (".." == e || "." == e) d = ""; else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
                d = 0 == e.lastIndexOf("/", 0);
                e = e.split("/");
                for (var f = [], g = 0; g < e.length;) {
                    var k = e[g++];
                    "." == k ? d && g == e.length && f.push("") :
                        ".." == k ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(), d && g == e.length && f.push("")) : (f.push(k), d = !0)
                }
                d = f.join("/")
            } else d = e
        }
        c ? (ug(b), b.la = d) : c = "" !== a.V.toString();
        c ? wg(b, a.V.clone()) : c = !!a.hb;
        c && (a = a.hb, ug(b), b.hb = a);
        return b
    };
    h.clone = function () {
        return new sg(this)
    };

    function tg(a, b, c) {
        ug(a);
        a.eb = c ? xg(b, !0) : b;
        a.eb && (a.eb = a.eb.replace(/:$/, ""))
    }

    function vg(a, b) {
        ug(a);
        if (b) {
            b = Number(b);
            if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
            a.Ib = b
        } else a.Ib = null
    }

    function wg(a, b, c) {
        ug(a);
        b instanceof yg ? (a.V = b, a.V.de(a.ra)) : (c || (b = zg(b, Eg)), a.V = new yg(b, a.ra))
    }

    h.getQuery = function () {
        return this.V.toString()
    };

    function Fg(a, b, c) {
        ug(a);
        a.V.set(b, c)
    }

    h.removeParameter = function (a) {
        ug(this);
        this.V.remove(a);
        return this
    };

    function ug(a) {
        if (a.dh) throw Error("Tried to modify a read-only Uri");
    }

    h.de = function (a) {
        this.ra = a;
        this.V && this.V.de(a)
    };

    function Gg(a) {
        return a instanceof sg ? a.clone() : new sg(a, void 0)
    }

    function Hg(a, b) {
        a instanceof sg || (a = Gg(a));
        b instanceof sg || (b = Gg(b));
        return a.resolve(b)
    }

    function xg(a, b) {
        return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
    }

    function zg(a, b, c) {
        return "string" === typeof a ? (a = encodeURI(a).replace(b, Ig), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
    }

    function Ig(a) {
        a = a.charCodeAt(0);
        return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
    }

    var Ag = /[#\/\?@]/g, Cg = /[#\?:]/g, Bg = /[#\?]/g, Eg = /[#\?@]/g, Dg = /#/g;

    function yg(a, b) {
        this.K = this.M = null;
        this.ka = a || null;
        this.ra = !!b
    }

    function Jg(a) {
        a.M || (a.M = new fe, a.K = 0, a.ka && ng(a.ka, function (b, c) {
            a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
        }))
    }

    h = yg.prototype;
    h.add = function (a, b) {
        Jg(this);
        this.ka = null;
        a = Kg(this, a);
        var c = this.M.get(a);
        c || this.M.set(a, c = []);
        c.push(b);
        this.K += 1;
        return this
    };
    h.remove = function (a) {
        Jg(this);
        a = Kg(this, a);
        return this.M.Ya(a) ? (this.ka = null, this.K -= this.M.get(a).length, this.M.remove(a)) : !1
    };
    h.clear = function () {
        this.M = this.ka = null;
        this.K = 0
    };
    h.hc = function () {
        Jg(this);
        return 0 == this.K
    };
    h.Ya = function (a) {
        Jg(this);
        a = Kg(this, a);
        return this.M.Ya(a)
    };
    h.forEach = function (a, b) {
        Jg(this);
        this.M.forEach(function (c, d) {
            La(c, function (e) {
                a.call(b, e, d, this)
            }, this)
        }, this)
    };
    h.Ja = function () {
        Jg(this);
        for (var a = this.M.qa(), b = this.M.Ja(), c = [], d = 0; d < b.length; d++) for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
        return c
    };
    h.qa = function (a) {
        Jg(this);
        var b = [];
        if ("string" === typeof a) this.Ya(a) && (b = Wa(b, this.M.get(Kg(this, a)))); else {
            a = this.M.qa();
            for (var c = 0; c < a.length; c++) b = Wa(b, a[c])
        }
        return b
    };
    h.set = function (a, b) {
        Jg(this);
        this.ka = null;
        a = Kg(this, a);
        this.Ya(a) && (this.K -= this.M.get(a).length);
        this.M.set(a, [b]);
        this.K += 1;
        return this
    };
    h.get = function (a, b) {
        if (!a) return b;
        a = this.qa(a);
        return 0 < a.length ? String(a[0]) : b
    };
    h.toString = function () {
        if (this.ka) return this.ka;
        if (!this.M) return "";
        for (var a = [], b = this.M.Ja(), c = 0; c < b.length; c++) {
            var d = b[c], e = encodeURIComponent(String(d));
            d = this.qa(d);
            for (var f = 0; f < d.length; f++) {
                var g = e;
                "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
                a.push(g)
            }
        }
        return this.ka = a.join("&")
    };
    h.clone = function () {
        var a = new yg;
        a.ka = this.ka;
        this.M && (a.M = this.M.clone(), a.K = this.K);
        return a
    };

    function Kg(a, b) {
        b = String(b);
        a.ra && (b = b.toLowerCase());
        return b
    }

    h.de = function (a) {
        a && !this.ra && (Jg(this), this.ka = null, this.M.forEach(function (b, c) {
            var d = c.toLowerCase();
            c != d && (this.remove(c), this.remove(d), 0 < b.length && (this.ka = null, this.M.set(Kg(this, d), Xa(b)), this.K += b.length))
        }, this));
        this.ra = a
    };
    h.extend = function (a) {
        for (var b = 0; b < arguments.length; b++) lg(arguments[b], function (c, d) {
            this.add(d, c)
        }, this)
    };
    var Lg = {Di: !0}, Mg = {Fi: !0}, Ng = {Ei: !0}, Og = {Ci: !0};

    function Pg() {
        throw Error("Do not instantiate directly");
    }

    Pg.prototype.Wb = null;
    Pg.prototype.toString = function () {
        return this.content
    };

    function Qg() {
        Pg.call(this)
    }

    x(Qg, Pg);
    Qg.prototype.gb = Lg;

    function Sg() {
        Pg.call(this)
    }

    x(Sg, Pg);
    Sg.prototype.gb = Mg;
    Sg.prototype.Wb = 1;

    function Tg(a, b, c, d) {
        a = a(b || Ug, void 0, c);
        d = (d || yc()).createElement("DIV");
        if (r(a)) if (a instanceof Pg) {
            if (a.gb !== Lg) throw Error("Sanitized content was not of kind HTML.");
            a = Wb(a.toString(), a.Wb || null)
        } else Ja("Soy template output is unsafe for use as HTML: " + a), a = Vb("zSoyz"); else a = Vb(String(a));
        a.za().match(Vg);
        if (Yb()) for (; d.lastChild;) d.removeChild(d.lastChild);
        d.innerHTML = Ub(a);
        1 == d.childNodes.length && (a = d.firstChild, 1 == a.nodeType && (d = a));
        return d
    }

    var Vg = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i, Ug = {};

    function Wg() {
    };

    function Xg() {
    }

    x(Xg, Wg);
    Xg.prototype.clear = function () {
        var a = ee(this.fb(!0)), b = this;
        La(a, function (c) {
            b.remove(c)
        })
    };

    function Yg(a) {
        this.sa = a
    }

    x(Yg, Xg);

    function Zg(a) {
        if (!a.sa) return !1;
        try {
            return a.sa.setItem("__sak", "1"), a.sa.removeItem("__sak"), !0
        } catch (b) {
            return !1
        }
    }

    h = Yg.prototype;
    h.set = function (a, b) {
        try {
            this.sa.setItem(a, b)
        } catch (c) {
            if (0 == this.sa.length) throw"Storage mechanism: Storage disabled";
            throw"Storage mechanism: Quota exceeded";
        }
    };
    h.get = function (a) {
        a = this.sa.getItem(a);
        if ("string" !== typeof a && null !== a) throw"Storage mechanism: Invalid value was encountered";
        return a
    };
    h.remove = function (a) {
        this.sa.removeItem(a)
    };
    h.fb = function (a) {
        var b = 0, c = this.sa, d = new be;
        d.next = function () {
            if (b >= c.length) throw ae;
            var e = c.key(b++);
            if (a) return e;
            e = c.getItem(e);
            if ("string" !== typeof e) throw"Storage mechanism: Invalid value was encountered";
            return e
        };
        return d
    };
    h.clear = function () {
        this.sa.clear()
    };
    h.key = function (a) {
        return this.sa.key(a)
    };

    function $g() {
        var a = null;
        try {
            a = window.localStorage || null
        } catch (b) {
        }
        this.sa = a
    }

    x($g, Yg);

    function ah() {
        var a = null;
        try {
            a = window.sessionStorage || null
        } catch (b) {
        }
        this.sa = a
    }

    x(ah, Yg);

    function bh(a, b) {
        this.kc = a;
        this.cb = b + "::"
    }

    x(bh, Xg);
    bh.prototype.set = function (a, b) {
        this.kc.set(this.cb + a, b)
    };
    bh.prototype.get = function (a) {
        return this.kc.get(this.cb + a)
    };
    bh.prototype.remove = function (a) {
        this.kc.remove(this.cb + a)
    };
    bh.prototype.fb = function (a) {
        var b = this.kc.fb(!0), c = this, d = new be;
        d.next = function () {
            for (var e = b.next(); e.substr(0, c.cb.length) != c.cb;) e = b.next();
            return a ? e.substr(c.cb.length) : c.kc.get(e)
        };
        return d
    };

    function ch(a) {
        this.Zc = a
    }

    ch.prototype.set = function (a, b) {
        void 0 === b ? this.Zc.remove(a) : this.Zc.set(a, Jf(b))
    };
    ch.prototype.get = function (a) {
        try {
            var b = this.Zc.get(a)
        } catch (c) {
            return
        }
        if (null !== b) try {
            return JSON.parse(b)
        } catch (c) {
            throw"Storage: Invalid value was encountered";
        }
    };
    ch.prototype.remove = function (a) {
        this.Zc.remove(a)
    };

    function dh(a) {
        this.ja = void 0;
        this.X = {};
        if (a) {
            var b = kg(a);
            a = jg(a);
            for (var c = 0; c < b.length; c++) this.set(b[c], a[c])
        }
    }

    h = dh.prototype;
    h.set = function (a, b) {
        eh(this, a, b, !1)
    };
    h.add = function (a, b) {
        eh(this, a, b, !0)
    };

    function eh(a, b, c, d) {
        for (var e = 0; e < b.length; e++) {
            var f = b.charAt(e);
            a.X[f] || (a.X[f] = new dh);
            a = a.X[f]
        }
        if (d && void 0 !== a.ja) throw Error('The collection already contains the key "' + b + '"');
        a.ja = c
    }

    h.get = function (a) {
        a:{
            for (var b = this, c = 0; c < a.length; c++) if (b = b.X[a.charAt(c)], !b) {
                a = void 0;
                break a
            }
            a = b
        }
        return a ? a.ja : void 0
    };
    h.qa = function () {
        var a = [];
        fh(this, a);
        return a
    };

    function fh(a, b) {
        void 0 !== a.ja && b.push(a.ja);
        for (var c in a.X) fh(a.X[c], b)
    }

    h.Ja = function (a) {
        var b = [];
        if (a) {
            for (var c = this, d = 0; d < a.length; d++) {
                var e = a.charAt(d);
                if (!c.X[e]) return [];
                c = c.X[e]
            }
            gh(c, a, b)
        } else gh(this, "", b);
        return b
    };

    function gh(a, b, c) {
        void 0 !== a.ja && c.push(b);
        for (var d in a.X) gh(a.X[d], b + d, c)
    }

    h.Ya = function (a) {
        return void 0 !== this.get(a)
    };
    h.clear = function () {
        this.X = {};
        this.ja = void 0
    };
    h.remove = function (a) {
        for (var b = this, c = [], d = 0; d < a.length; d++) {
            var e = a.charAt(d);
            if (!b.X[e]) throw Error('The collection does not have the key "' + a + '"');
            c.push([b, e]);
            b = b.X[e]
        }
        a = b.ja;
        for (delete b.ja; 0 < c.length;) if (e = c.pop(), b = e[0], e = e[1], b.X[e].hc()) delete b.X[e]; else break;
        return a
    };
    h.clone = function () {
        return new dh(this)
    };
    h.hc = function () {
        var a;
        if (a = void 0 === this.ja) a:{
            for (var b in this.X) {
                a = !1;
                break a
            }
            a = !0
        }
        return a
    };

    function hh(a, b) {
        var c = Ac(a);
        return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : ""
    }

    function ih(a) {
        try {
            var b = a.getBoundingClientRect()
        } catch (c) {
            return {left: 0, top: 0, right: 0, bottom: 0}
        }
        A && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
        return b
    }

    function jh(a, b) {
        b = b || Gc(document);
        var c = b || Gc(document);
        var d = kh(a), e = kh(c);
        if (!A || 9 <= Number(tc)) {
            g = hh(c, "borderLeftWidth");
            var f = hh(c, "borderRightWidth");
            k = hh(c, "borderTopWidth");
            l = hh(c, "borderBottomWidth");
            f = new Rf(parseFloat(k), parseFloat(f), parseFloat(l), parseFloat(g))
        } else {
            var g = lh(c, "borderLeft");
            f = lh(c, "borderRight");
            var k = lh(c, "borderTop"), l = lh(c, "borderBottom");
            f = new Rf(k, f, l, g)
        }
        c == Gc(document) ? (g = d.x - c.scrollLeft, d = d.y - c.scrollTop, !A || 10 <= Number(tc) || (g += f.left, d += f.top)) : (g = d.x - e.x - f.left,
            d = d.y - e.y - f.top);
        e = a.offsetWidth;
        f = a.offsetHeight;
        k = jc && !e && !f;
        (void 0 === e || k) && a.getBoundingClientRect ? (a = ih(a), a = new xc(a.right - a.left, a.bottom - a.top)) : a = new xc(e, f);
        e = c.clientHeight - a.height;
        f = c.scrollLeft;
        k = c.scrollTop;
        f += Math.min(g, Math.max(g - (c.clientWidth - a.width), 0));
        k += Math.min(d, Math.max(d - e, 0));
        c = new wc(f, k);
        b.scrollLeft = c.x;
        b.scrollTop = c.y
    }

    function kh(a) {
        var b = Ac(a), c = new wc(0, 0);
        var d = b ? Ac(b) : document;
        d = !A || 9 <= Number(tc) || "CSS1Compat" == yc(d).ea.compatMode ? d.documentElement : d.body;
        if (a == d) return c;
        a = ih(a);
        d = yc(b).ea;
        b = Gc(d);
        d = d.parentWindow || d.defaultView;
        b = A && sc("10") && d.pageYOffset != b.scrollTop ? new wc(b.scrollLeft, b.scrollTop) : new wc(d.pageXOffset || b.scrollLeft, d.pageYOffset || b.scrollTop);
        c.x = a.left + b.x;
        c.y = a.top + b.y;
        return c
    }

    var mh = {thin: 2, medium: 4, thick: 6};

    function lh(a, b) {
        if ("none" == (a.currentStyle ? a.currentStyle[b + "Style"] : null)) return 0;
        var c = a.currentStyle ? a.currentStyle[b + "Width"] : null;
        if (c in mh) a = mh[c]; else if (/^\d+px?$/.test(c)) a = parseInt(c, 10); else {
            b = a.style.left;
            var d = a.runtimeStyle.left;
            a.runtimeStyle.left = a.currentStyle.left;
            a.style.left = c;
            c = a.style.pixelLeft;
            a.style.left = b;
            a.runtimeStyle.left = d;
            a = +c
        }
        return a
    };

    function nh() {
    }

    xa(nh);
    nh.prototype.mh = 0;
    nh.prototype.Xg = "";

    function oh(a) {
        Qe.call(this);
        this.Xb = a || yc();
        this.lb = null;
        this.mb = !1;
        this.f = null;
        this.ab = void 0;
        this.Ec = this.Ga = this.F = null;
        this.ci = !1
    }

    x(oh, Qe);
    h = oh.prototype;
    h.Wg = nh.Hd();
    h.getId = function () {
        var a;
        (a = this.lb) || (a = this.Wg, a = this.lb = a.Xg + ":" + (a.mh++).toString(36));
        return a
    };
    h.fa = function () {
        return this.f
    };
    h.Kc = function (a) {
        return this.f ? this.Xb.Kc(a, this.f) : []
    };
    h.s = function (a) {
        return this.f ? this.Xb.s(a, this.f) : null
    };

    function ph(a) {
        a.ab || (a.ab = new bf(a));
        return a.ab
    }

    h.getParent = function () {
        return this.F
    };
    h.fe = function (a) {
        if (this.F && this.F != a) throw Error("Method not supported");
        oh.Z.fe.call(this, a)
    };
    h.Bb = function () {
        return this.Xb
    };
    h.Dd = function () {
        this.f = this.Xb.createElement("DIV")
    };
    h.render = function (a) {
        if (this.mb) throw Error("Component already rendered");
        this.f || this.Dd();
        a ? a.insertBefore(this.f, null) : this.Xb.ea.body.appendChild(this.f);
        this.F && !this.F.mb || this.j()
    };
    h.j = function () {
        this.mb = !0;
        qh(this, function (a) {
            !a.mb && a.fa() && a.j()
        })
    };
    h.$b = function () {
        qh(this, function (a) {
            a.mb && a.$b()
        });
        this.ab && this.ab.gd();
        this.mb = !1
    };
    h.h = function () {
        this.mb && this.$b();
        this.ab && (this.ab.i(), delete this.ab);
        qh(this, function (a) {
            a.i()
        });
        !this.ci && this.f && Kc(this.f);
        this.F = this.f = this.Ec = this.Ga = null;
        oh.Z.h.call(this)
    };
    h.hasChildren = function () {
        return !!this.Ga && 0 != this.Ga.length
    };

    function qh(a, b) {
        a.Ga && La(a.Ga, b, void 0)
    }

    h.removeChild = function (a, b) {
        if (a) {
            var c = "string" === typeof a ? a : a.getId();
            this.Ec && c ? (a = this.Ec, a = (null !== a && c in a ? a[c] : void 0) || null) : a = null;
            if (c && a) {
                var d = this.Ec;
                c in d && delete d[c];
                Sa(this.Ga, a);
                b && (a.$b(), a.f && Kc(a.f));
                b = a;
                if (null == b) throw Error("Unable to set parent component");
                b.F = null;
                oh.Z.fe.call(b, null)
            }
        }
        if (!a) throw Error("Child is not in parent component");
        return a
    };

    function rh(a, b) {
        return null != a && a.gb === b
    };

    function sh(a) {
        if (null != a) switch (a.Wb) {
            case 1:
                return 1;
            case -1:
                return -1;
            case 0:
                return 0
        }
        return null
    }

    function D(a) {
        return rh(a, Lg) ? a : a instanceof Sb ? E(Ub(a).toString(), a.Jc()) : E(bc(String(String(a))), sh(a))
    }

    var E = function (a) {
        function b(c) {
            this.content = c
        }

        b.prototype = a.prototype;
        return function (c, d) {
            c = new b(String(c));
            void 0 !== d && (c.Wb = d);
            return c
        }
    }(Qg), th = function (a) {
        function b(c) {
            this.content = c
        }

        b.prototype = a.prototype;
        return function (c) {
            return new b(String(c))
        }
    }(Sg);

    function uh(a, b) {
        return Ba(a) && Ba(b) ? a.gb !== b.gb ? !1 : a.toString() === b.toString() : a instanceof Pg && b instanceof Pg ? a.gb != b.gb ? !1 : a.toString() == b.toString() : a == b
    }

    function vh(a) {
        return a instanceof Pg ? !!a.content : !!a
    }

    var wh = function (a) {
        function b(c) {
            this.content = c
        }

        b.prototype = a.prototype;
        return function (c, d) {
            c = String(c);
            if (!c) return "";
            c = new b(c);
            void 0 !== d && (c.Wb = d);
            return c
        }
    }(Qg);

    function xh(a) {
        return a.replace(/<\//g, "<\\/").replace(/\]\]>/g, "]]\\>")
    }

    function yh(a) {
        return rh(a, Lg) ? String(String(a.content).replace(zh, "").replace(Ah, "&lt;")).replace(Bh, Ch) : bc(String(a))
    }

    function Dh(a) {
        rh(a, Mg) || rh(a, Ng) ? a = Eh(a) : a instanceof Gb ? a = Eh(Jb(a)) : a instanceof Cb ? a = Eh(Fb(a).toString()) : (a = String(a), Fh.test(a) ? a = a.replace(Gh, Hh) : (Ja("Bad value `%s` for |filterNormalizeUri", [a]), a = "about:invalid#zSoyz"));
        return a
    }

    function Ih(a) {
        rh(a, Mg) || rh(a, Ng) ? a = Eh(a) : a instanceof Gb ? a = Eh(Jb(a)) : a instanceof Cb ? a = Eh(Fb(a).toString()) : (a = String(a), Jh.test(a) ? a = a.replace(Gh, Hh) : (Ja("Bad value `%s` for |filterNormalizeMediaUri", [a]), a = "about:invalid#zSoyz"));
        return a
    }

    function Kh(a) {
        rh(a, Og) ? a = xh(a.content) : null == a ? a = "" : a instanceof Nb ? (a instanceof Nb && a.constructor === Nb && a.dg === Pb ? a = a.ed : (Ja("expected object of type SafeStyle, got '" + a + "' of type " + ya(a)), a = "type_error:SafeStyle"), a = xh(a)) : a instanceof Qb ? (a instanceof Qb && a.constructor === Qb && a.cg === Rb ? a = a.dd : (Ja("expected object of type SafeStyleSheet, got '" + a + "' of type " + ya(a)), a = "type_error:SafeStyleSheet"), a = xh(a)) : (a = String(a), Lh.test(a) || (Ja("Bad value `%s` for |filterCssValue", [a]), a = "zSoyz"));
        return a
    }

    function G(a, b, c, d) {
        a || (a = c instanceof Function ? c.displayName || c.name || "unknown type name" : c instanceof Object ? c.constructor.displayName || c.constructor.name || Object.prototype.toString.call(c) : null === c ? "null" : typeof c, Ja("expected param " + b + " of type " + d + (", but got " + a) + "."));
        return c
    }

    var Mh = {
        "\x00": "&#0;",
        "\t": "&#9;",
        "\n": "&#10;",
        "\x0B": "&#11;",
        "\f": "&#12;",
        "\r": "&#13;",
        " ": "&#32;",
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#39;",
        "-": "&#45;",
        "/": "&#47;",
        "<": "&lt;",
        "=": "&#61;",
        ">": "&gt;",
        "`": "&#96;",
        "\u0085": "&#133;",
        "\u00a0": "&#160;",
        "\u2028": "&#8232;",
        "\u2029": "&#8233;"
    };

    function Ch(a) {
        return Mh[a]
    }

    var Nh = {
        "\x00": "%00",
        "\u0001": "%01",
        "\u0002": "%02",
        "\u0003": "%03",
        "\u0004": "%04",
        "\u0005": "%05",
        "\u0006": "%06",
        "\u0007": "%07",
        "\b": "%08",
        "\t": "%09",
        "\n": "%0A",
        "\x0B": "%0B",
        "\f": "%0C",
        "\r": "%0D",
        "\u000e": "%0E",
        "\u000f": "%0F",
        "\u0010": "%10",
        "\u0011": "%11",
        "\u0012": "%12",
        "\u0013": "%13",
        "\u0014": "%14",
        "\u0015": "%15",
        "\u0016": "%16",
        "\u0017": "%17",
        "\u0018": "%18",
        "\u0019": "%19",
        "\u001a": "%1A",
        "\u001b": "%1B",
        "\u001c": "%1C",
        "\u001d": "%1D",
        "\u001e": "%1E",
        "\u001f": "%1F",
        " ": "%20",
        '"': "%22",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "<": "%3C",
        ">": "%3E",
        "\\": "%5C",
        "{": "%7B",
        "}": "%7D",
        "\u007f": "%7F",
        "\u0085": "%C2%85",
        "\u00a0": "%C2%A0",
        "\u2028": "%E2%80%A8",
        "\u2029": "%E2%80%A9",
        "\uff01": "%EF%BC%81",
        "\uff03": "%EF%BC%83",
        "\uff04": "%EF%BC%84",
        "\uff06": "%EF%BC%86",
        "\uff07": "%EF%BC%87",
        "\uff08": "%EF%BC%88",
        "\uff09": "%EF%BC%89",
        "\uff0a": "%EF%BC%8A",
        "\uff0b": "%EF%BC%8B",
        "\uff0c": "%EF%BC%8C",
        "\uff0f": "%EF%BC%8F",
        "\uff1a": "%EF%BC%9A",
        "\uff1b": "%EF%BC%9B",
        "\uff1d": "%EF%BC%9D",
        "\uff1f": "%EF%BC%9F",
        "\uff20": "%EF%BC%A0",
        "\uff3b": "%EF%BC%BB",
        "\uff3d": "%EF%BC%BD"
    };

    function Hh(a) {
        return Nh[a]
    }

    var Bh = /[\x00\x22\x27\x3c\x3e]/g,
        Gh = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g,
        Lh = /^(?!-*(?:expression|(?:moz-)?binding))(?:(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|(?:rgb|hsl)a?\([0-9.%,\u0020]+\)|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,4}|%)?|!important)(?:\s*[,\u0020]\s*|$))*$/i,
        Fh = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i,
        Jh = /^[^&:\/?#]*(?:[\/?#]|$)|^https?:|^data:image\/[a-z0-9+]+;base64,[a-z0-9+\/]+=*$|^blob:/i;

    function Eh(a) {
        return String(a).replace(Gh, Hh)
    }

    var zh = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g, Ah = /</g;

    function Oh(a) {
        this.Sa = a;
        this.je = new dh;
        for (a = 0; a < this.Sa.length; a++) {
            var b = this.je.get("+" + this.Sa[a].a);
            b ? b.push(this.Sa[a]) : this.je.add("+" + this.Sa[a].a, [this.Sa[a]])
        }
    }

    Oh.prototype.search = function (a) {
        var b = this.je, c = {}, d = 0;
        void 0 !== b.ja && (c[d] = b.ja);
        for (; d < a.length; d++) {
            var e = a.charAt(d);
            if (!(e in b.X)) break;
            b = b.X[e];
            void 0 !== b.ja && (c[d] = b.ja)
        }
        for (var f in c) if (c.hasOwnProperty(f)) return c[f];
        return []
    };

    function Ph(a) {
        for (var b = 0; b < Qh.length; b++) if (Qh[b].b === a) return Qh[b];
        return null
    }

    function Rh(a) {
        a = a.toUpperCase();
        for (var b = [], c = 0; c < Qh.length; c++) Qh[c].c === a && b.push(Qh[c]);
        return b
    }

    function Sh(a) {
        if (0 < a.length && "+" == a.charAt(0)) {
            a = a.substring(1);
            for (var b = [], c = 0; c < Qh.length; c++) Qh[c].a == a && b.push(Qh[c]);
            a = b
        } else a = Rh(a);
        return a
    }

    function Th(a) {
        a.sort(function (b, c) {
            return b.name.localeCompare(c.name, "en")
        })
    }

    var Qh = [{name: "Afghanistan", b: "93-AF-0", a: "93", c: "AF"}, {
        name: "\u00c5land Islands",
        b: "358-AX-0",
        a: "358",
        c: "AX"
    }, {name: "Albania", b: "355-AL-0", a: "355", c: "AL"}, {
        name: "Algeria",
        b: "213-DZ-0",
        a: "213",
        c: "DZ"
    }, {name: "American Samoa", b: "1-AS-0", a: "1", c: "AS"}, {
        name: "Andorra",
        b: "376-AD-0",
        a: "376",
        c: "AD"
    }, {name: "Angola", b: "244-AO-0", a: "244", c: "AO"}, {
        name: "Anguilla",
        b: "1-AI-0",
        a: "1",
        c: "AI"
    }, {name: "Antigua and Barbuda", b: "1-AG-0", a: "1", c: "AG"}, {
        name: "Argentina",
        b: "54-AR-0",
        a: "54",
        c: "AR"
    }, {
        name: "Armenia", b: "374-AM-0",
        a: "374", c: "AM"
    }, {name: "Aruba", b: "297-AW-0", a: "297", c: "AW"}, {
        name: "Ascension Island",
        b: "247-AC-0",
        a: "247",
        c: "AC"
    }, {name: "Australia", b: "61-AU-0", a: "61", c: "AU"}, {
        name: "Austria",
        b: "43-AT-0",
        a: "43",
        c: "AT"
    }, {name: "Azerbaijan", b: "994-AZ-0", a: "994", c: "AZ"}, {
        name: "Bahamas",
        b: "1-BS-0",
        a: "1",
        c: "BS"
    }, {name: "Bahrain", b: "973-BH-0", a: "973", c: "BH"}, {
        name: "Bangladesh",
        b: "880-BD-0",
        a: "880",
        c: "BD"
    }, {name: "Barbados", b: "1-BB-0", a: "1", c: "BB"}, {name: "Belarus", b: "375-BY-0", a: "375", c: "BY"}, {
        name: "Belgium", b: "32-BE-0", a: "32",
        c: "BE"
    }, {name: "Belize", b: "501-BZ-0", a: "501", c: "BZ"}, {
        name: "Benin",
        b: "229-BJ-0",
        a: "229",
        c: "BJ"
    }, {name: "Bermuda", b: "1-BM-0", a: "1", c: "BM"}, {
        name: "Bhutan",
        b: "975-BT-0",
        a: "975",
        c: "BT"
    }, {name: "Bolivia", b: "591-BO-0", a: "591", c: "BO"}, {
        name: "Bosnia and Herzegovina",
        b: "387-BA-0",
        a: "387",
        c: "BA"
    }, {name: "Botswana", b: "267-BW-0", a: "267", c: "BW"}, {
        name: "Brazil",
        b: "55-BR-0",
        a: "55",
        c: "BR"
    }, {name: "British Indian Ocean Territory", b: "246-IO-0", a: "246", c: "IO"}, {
        name: "British Virgin Islands",
        b: "1-VG-0",
        a: "1",
        c: "VG"
    }, {
        name: "Brunei",
        b: "673-BN-0", a: "673", c: "BN"
    }, {name: "Bulgaria", b: "359-BG-0", a: "359", c: "BG"}, {
        name: "Burkina Faso",
        b: "226-BF-0",
        a: "226",
        c: "BF"
    }, {name: "Burundi", b: "257-BI-0", a: "257", c: "BI"}, {
        name: "Cambodia",
        b: "855-KH-0",
        a: "855",
        c: "KH"
    }, {name: "Cameroon", b: "237-CM-0", a: "237", c: "CM"}, {
        name: "Canada",
        b: "1-CA-0",
        a: "1",
        c: "CA"
    }, {name: "Cape Verde", b: "238-CV-0", a: "238", c: "CV"}, {
        name: "Caribbean Netherlands",
        b: "599-BQ-0",
        a: "599",
        c: "BQ"
    }, {name: "Cayman Islands", b: "1-KY-0", a: "1", c: "KY"}, {
        name: "Central African Republic", b: "236-CF-0",
        a: "236", c: "CF"
    }, {name: "Chad", b: "235-TD-0", a: "235", c: "TD"}, {
        name: "Chile",
        b: "56-CL-0",
        a: "56",
        c: "CL"
    }, {name: "China", b: "86-CN-0", a: "86", c: "CN"}, {
        name: "Christmas Island",
        b: "61-CX-0",
        a: "61",
        c: "CX"
    }, {name: "Cocos [Keeling] Islands", b: "61-CC-0", a: "61", c: "CC"}, {
        name: "Colombia",
        b: "57-CO-0",
        a: "57",
        c: "CO"
    }, {name: "Comoros", b: "269-KM-0", a: "269", c: "KM"}, {
        name: "Democratic Republic Congo",
        b: "243-CD-0",
        a: "243",
        c: "CD"
    }, {name: "Republic of Congo", b: "242-CG-0", a: "242", c: "CG"}, {
        name: "Cook Islands",
        b: "682-CK-0",
        a: "682",
        c: "CK"
    },
        {name: "Costa Rica", b: "506-CR-0", a: "506", c: "CR"}, {
            name: "C\u00f4te d'Ivoire",
            b: "225-CI-0",
            a: "225",
            c: "CI"
        }, {name: "Croatia", b: "385-HR-0", a: "385", c: "HR"}, {
            name: "Cuba",
            b: "53-CU-0",
            a: "53",
            c: "CU"
        }, {name: "Cura\u00e7ao", b: "599-CW-0", a: "599", c: "CW"}, {
            name: "Cyprus",
            b: "357-CY-0",
            a: "357",
            c: "CY"
        }, {name: "Czech Republic", b: "420-CZ-0", a: "420", c: "CZ"}, {
            name: "Denmark",
            b: "45-DK-0",
            a: "45",
            c: "DK"
        }, {name: "Djibouti", b: "253-DJ-0", a: "253", c: "DJ"}, {name: "Dominica", b: "1-DM-0", a: "1", c: "DM"}, {
            name: "Dominican Republic", b: "1-DO-0",
            a: "1", c: "DO"
        }, {name: "East Timor", b: "670-TL-0", a: "670", c: "TL"}, {
            name: "Ecuador",
            b: "593-EC-0",
            a: "593",
            c: "EC"
        }, {name: "Egypt", b: "20-EG-0", a: "20", c: "EG"}, {
            name: "El Salvador",
            b: "503-SV-0",
            a: "503",
            c: "SV"
        }, {name: "Equatorial Guinea", b: "240-GQ-0", a: "240", c: "GQ"}, {
            name: "Eritrea",
            b: "291-ER-0",
            a: "291",
            c: "ER"
        }, {name: "Estonia", b: "372-EE-0", a: "372", c: "EE"}, {
            name: "Ethiopia",
            b: "251-ET-0",
            a: "251",
            c: "ET"
        }, {name: "Falkland Islands [Islas Malvinas]", b: "500-FK-0", a: "500", c: "FK"}, {
            name: "Faroe Islands", b: "298-FO-0", a: "298",
            c: "FO"
        }, {name: "Fiji", b: "679-FJ-0", a: "679", c: "FJ"}, {
            name: "Finland",
            b: "358-FI-0",
            a: "358",
            c: "FI"
        }, {name: "France", b: "33-FR-0", a: "33", c: "FR"}, {
            name: "French Guiana",
            b: "594-GF-0",
            a: "594",
            c: "GF"
        }, {name: "French Polynesia", b: "689-PF-0", a: "689", c: "PF"}, {
            name: "Gabon",
            b: "241-GA-0",
            a: "241",
            c: "GA"
        }, {name: "Gambia", b: "220-GM-0", a: "220", c: "GM"}, {
            name: "Georgia",
            b: "995-GE-0",
            a: "995",
            c: "GE"
        }, {name: "Germany", b: "49-DE-0", a: "49", c: "DE"}, {
            name: "Ghana",
            b: "233-GH-0",
            a: "233",
            c: "GH"
        }, {name: "Gibraltar", b: "350-GI-0", a: "350", c: "GI"},
        {name: "Greece", b: "30-GR-0", a: "30", c: "GR"}, {
            name: "Greenland",
            b: "299-GL-0",
            a: "299",
            c: "GL"
        }, {name: "Grenada", b: "1-GD-0", a: "1", c: "GD"}, {
            name: "Guadeloupe",
            b: "590-GP-0",
            a: "590",
            c: "GP"
        }, {name: "Guam", b: "1-GU-0", a: "1", c: "GU"}, {
            name: "Guatemala",
            b: "502-GT-0",
            a: "502",
            c: "GT"
        }, {name: "Guernsey", b: "44-GG-0", a: "44", c: "GG"}, {
            name: "Guinea Conakry",
            b: "224-GN-0",
            a: "224",
            c: "GN"
        }, {name: "Guinea-Bissau", b: "245-GW-0", a: "245", c: "GW"}, {
            name: "Guyana",
            b: "592-GY-0",
            a: "592",
            c: "GY"
        }, {name: "Haiti", b: "509-HT-0", a: "509", c: "HT"}, {
            name: "Heard Island and McDonald Islands",
            b: "672-HM-0", a: "672", c: "HM"
        }, {name: "Honduras", b: "504-HN-0", a: "504", c: "HN"}, {
            name: "Hong Kong",
            b: "852-HK-0",
            a: "852",
            c: "HK"
        }, {name: "Hungary", b: "36-HU-0", a: "36", c: "HU"}, {
            name: "Iceland",
            b: "354-IS-0",
            a: "354",
            c: "IS"
        }, {name: "India", b: "91-IN-0", a: "91", c: "IN"}, {
            name: "Indonesia",
            b: "62-ID-0",
            a: "62",
            c: "ID"
        }, {name: "Iran", b: "98-IR-0", a: "98", c: "IR"}, {
            name: "Iraq",
            b: "964-IQ-0",
            a: "964",
            c: "IQ"
        }, {name: "Ireland", b: "353-IE-0", a: "353", c: "IE"}, {name: "Isle of Man", b: "44-IM-0", a: "44", c: "IM"}, {
            name: "Israel", b: "972-IL-0", a: "972",
            c: "IL"
        }, {name: "Italy", b: "39-IT-0", a: "39", c: "IT"}, {
            name: "Jamaica",
            b: "1-JM-0",
            a: "1",
            c: "JM"
        }, {name: "Japan", b: "81-JP-0", a: "81", c: "JP"}, {
            name: "Jersey",
            b: "44-JE-0",
            a: "44",
            c: "JE"
        }, {name: "Jordan", b: "962-JO-0", a: "962", c: "JO"}, {
            name: "Kazakhstan",
            b: "7-KZ-0",
            a: "7",
            c: "KZ"
        }, {name: "Kenya", b: "254-KE-0", a: "254", c: "KE"}, {
            name: "Kiribati",
            b: "686-KI-0",
            a: "686",
            c: "KI"
        }, {name: "Kosovo", b: "377-XK-0", a: "377", c: "XK"}, {
            name: "Kosovo",
            b: "381-XK-0",
            a: "381",
            c: "XK"
        }, {name: "Kosovo", b: "386-XK-0", a: "386", c: "XK"}, {
            name: "Kuwait", b: "965-KW-0",
            a: "965", c: "KW"
        }, {name: "Kyrgyzstan", b: "996-KG-0", a: "996", c: "KG"}, {
            name: "Laos",
            b: "856-LA-0",
            a: "856",
            c: "LA"
        }, {name: "Latvia", b: "371-LV-0", a: "371", c: "LV"}, {
            name: "Lebanon",
            b: "961-LB-0",
            a: "961",
            c: "LB"
        }, {name: "Lesotho", b: "266-LS-0", a: "266", c: "LS"}, {
            name: "Liberia",
            b: "231-LR-0",
            a: "231",
            c: "LR"
        }, {name: "Libya", b: "218-LY-0", a: "218", c: "LY"}, {
            name: "Liechtenstein",
            b: "423-LI-0",
            a: "423",
            c: "LI"
        }, {name: "Lithuania", b: "370-LT-0", a: "370", c: "LT"}, {
            name: "Luxembourg",
            b: "352-LU-0",
            a: "352",
            c: "LU"
        }, {
            name: "Macau", b: "853-MO-0",
            a: "853", c: "MO"
        }, {name: "Macedonia", b: "389-MK-0", a: "389", c: "MK"}, {
            name: "Madagascar",
            b: "261-MG-0",
            a: "261",
            c: "MG"
        }, {name: "Malawi", b: "265-MW-0", a: "265", c: "MW"}, {
            name: "Malaysia",
            b: "60-MY-0",
            a: "60",
            c: "MY"
        }, {name: "Maldives", b: "960-MV-0", a: "960", c: "MV"}, {
            name: "Mali",
            b: "223-ML-0",
            a: "223",
            c: "ML"
        }, {name: "Malta", b: "356-MT-0", a: "356", c: "MT"}, {
            name: "Marshall Islands",
            b: "692-MH-0",
            a: "692",
            c: "MH"
        }, {name: "Martinique", b: "596-MQ-0", a: "596", c: "MQ"}, {
            name: "Mauritania",
            b: "222-MR-0",
            a: "222",
            c: "MR"
        }, {
            name: "Mauritius", b: "230-MU-0",
            a: "230", c: "MU"
        }, {name: "Mayotte", b: "262-YT-0", a: "262", c: "YT"}, {
            name: "Mexico",
            b: "52-MX-0",
            a: "52",
            c: "MX"
        }, {name: "Micronesia", b: "691-FM-0", a: "691", c: "FM"}, {
            name: "Moldova",
            b: "373-MD-0",
            a: "373",
            c: "MD"
        }, {name: "Monaco", b: "377-MC-0", a: "377", c: "MC"}, {
            name: "Mongolia",
            b: "976-MN-0",
            a: "976",
            c: "MN"
        }, {name: "Montenegro", b: "382-ME-0", a: "382", c: "ME"}, {
            name: "Montserrat",
            b: "1-MS-0",
            a: "1",
            c: "MS"
        }, {name: "Morocco", b: "212-MA-0", a: "212", c: "MA"}, {
            name: "Mozambique",
            b: "258-MZ-0",
            a: "258",
            c: "MZ"
        }, {
            name: "Myanmar [Burma]", b: "95-MM-0",
            a: "95", c: "MM"
        }, {name: "Namibia", b: "264-NA-0", a: "264", c: "NA"}, {
            name: "Nauru",
            b: "674-NR-0",
            a: "674",
            c: "NR"
        }, {name: "Nepal", b: "977-NP-0", a: "977", c: "NP"}, {
            name: "Netherlands",
            b: "31-NL-0",
            a: "31",
            c: "NL"
        }, {name: "New Caledonia", b: "687-NC-0", a: "687", c: "NC"}, {
            name: "New Zealand",
            b: "64-NZ-0",
            a: "64",
            c: "NZ"
        }, {name: "Nicaragua", b: "505-NI-0", a: "505", c: "NI"}, {
            name: "Niger",
            b: "227-NE-0",
            a: "227",
            c: "NE"
        }, {name: "Nigeria", b: "234-NG-0", a: "234", c: "NG"}, {name: "Niue", b: "683-NU-0", a: "683", c: "NU"}, {
            name: "Norfolk Island", b: "672-NF-0",
            a: "672", c: "NF"
        }, {name: "North Korea", b: "850-KP-0", a: "850", c: "KP"}, {
            name: "Northern Mariana Islands",
            b: "1-MP-0",
            a: "1",
            c: "MP"
        }, {name: "Norway", b: "47-NO-0", a: "47", c: "NO"}, {
            name: "Oman",
            b: "968-OM-0",
            a: "968",
            c: "OM"
        }, {name: "Pakistan", b: "92-PK-0", a: "92", c: "PK"}, {
            name: "Palau",
            b: "680-PW-0",
            a: "680",
            c: "PW"
        }, {name: "Palestinian Territories", b: "970-PS-0", a: "970", c: "PS"}, {
            name: "Panama",
            b: "507-PA-0",
            a: "507",
            c: "PA"
        }, {name: "Papua New Guinea", b: "675-PG-0", a: "675", c: "PG"}, {
            name: "Paraguay",
            b: "595-PY-0",
            a: "595",
            c: "PY"
        }, {
            name: "Peru",
            b: "51-PE-0", a: "51", c: "PE"
        }, {name: "Philippines", b: "63-PH-0", a: "63", c: "PH"}, {
            name: "Poland",
            b: "48-PL-0",
            a: "48",
            c: "PL"
        }, {name: "Portugal", b: "351-PT-0", a: "351", c: "PT"}, {
            name: "Puerto Rico",
            b: "1-PR-0",
            a: "1",
            c: "PR"
        }, {name: "Qatar", b: "974-QA-0", a: "974", c: "QA"}, {
            name: "R\u00e9union",
            b: "262-RE-0",
            a: "262",
            c: "RE"
        }, {name: "Romania", b: "40-RO-0", a: "40", c: "RO"}, {
            name: "Russia",
            b: "7-RU-0",
            a: "7",
            c: "RU"
        }, {name: "Rwanda", b: "250-RW-0", a: "250", c: "RW"}, {
            name: "Saint Barth\u00e9lemy",
            b: "590-BL-0",
            a: "590",
            c: "BL"
        }, {
            name: "Saint Helena",
            b: "290-SH-0", a: "290", c: "SH"
        }, {name: "St. Kitts", b: "1-KN-0", a: "1", c: "KN"}, {
            name: "St. Lucia",
            b: "1-LC-0",
            a: "1",
            c: "LC"
        }, {name: "Saint Martin", b: "590-MF-0", a: "590", c: "MF"}, {
            name: "Saint Pierre and Miquelon",
            b: "508-PM-0",
            a: "508",
            c: "PM"
        }, {name: "St. Vincent", b: "1-VC-0", a: "1", c: "VC"}, {
            name: "Samoa",
            b: "685-WS-0",
            a: "685",
            c: "WS"
        }, {name: "San Marino", b: "378-SM-0", a: "378", c: "SM"}, {
            name: "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
            b: "239-ST-0",
            a: "239",
            c: "ST"
        }, {name: "Saudi Arabia", b: "966-SA-0", a: "966", c: "SA"}, {
            name: "Senegal",
            b: "221-SN-0", a: "221", c: "SN"
        }, {name: "Serbia", b: "381-RS-0", a: "381", c: "RS"}, {
            name: "Seychelles",
            b: "248-SC-0",
            a: "248",
            c: "SC"
        }, {name: "Sierra Leone", b: "232-SL-0", a: "232", c: "SL"}, {
            name: "Singapore",
            b: "65-SG-0",
            a: "65",
            c: "SG"
        }, {name: "Sint Maarten", b: "1-SX-0", a: "1", c: "SX"}, {
            name: "Slovakia",
            b: "421-SK-0",
            a: "421",
            c: "SK"
        }, {name: "Slovenia", b: "386-SI-0", a: "386", c: "SI"}, {
            name: "Solomon Islands",
            b: "677-SB-0",
            a: "677",
            c: "SB"
        }, {name: "Somalia", b: "252-SO-0", a: "252", c: "SO"}, {
            name: "South Africa",
            b: "27-ZA-0",
            a: "27",
            c: "ZA"
        }, {
            name: "South Georgia and the South Sandwich Islands",
            b: "500-GS-0", a: "500", c: "GS"
        }, {name: "South Korea", b: "82-KR-0", a: "82", c: "KR"}, {
            name: "South Sudan",
            b: "211-SS-0",
            a: "211",
            c: "SS"
        }, {name: "Spain", b: "34-ES-0", a: "34", c: "ES"}, {
            name: "Sri Lanka",
            b: "94-LK-0",
            a: "94",
            c: "LK"
        }, {name: "Sudan", b: "249-SD-0", a: "249", c: "SD"}, {
            name: "Suriname",
            b: "597-SR-0",
            a: "597",
            c: "SR"
        }, {name: "Svalbard and Jan Mayen", b: "47-SJ-0", a: "47", c: "SJ"}, {
            name: "Swaziland",
            b: "268-SZ-0",
            a: "268",
            c: "SZ"
        }, {name: "Sweden", b: "46-SE-0", a: "46", c: "SE"}, {name: "Switzerland", b: "41-CH-0", a: "41", c: "CH"}, {
            name: "Syria",
            b: "963-SY-0", a: "963", c: "SY"
        }, {name: "Taiwan", b: "886-TW-0", a: "886", c: "TW"}, {
            name: "Tajikistan",
            b: "992-TJ-0",
            a: "992",
            c: "TJ"
        }, {name: "Tanzania", b: "255-TZ-0", a: "255", c: "TZ"}, {
            name: "Thailand",
            b: "66-TH-0",
            a: "66",
            c: "TH"
        }, {name: "Togo", b: "228-TG-0", a: "228", c: "TG"}, {
            name: "Tokelau",
            b: "690-TK-0",
            a: "690",
            c: "TK"
        }, {name: "Tonga", b: "676-TO-0", a: "676", c: "TO"}, {
            name: "Trinidad/Tobago",
            b: "1-TT-0",
            a: "1",
            c: "TT"
        }, {name: "Tunisia", b: "216-TN-0", a: "216", c: "TN"}, {name: "Turkey", b: "90-TR-0", a: "90", c: "TR"}, {
            name: "Turkmenistan", b: "993-TM-0",
            a: "993", c: "TM"
        }, {name: "Turks and Caicos Islands", b: "1-TC-0", a: "1", c: "TC"}, {
            name: "Tuvalu",
            b: "688-TV-0",
            a: "688",
            c: "TV"
        }, {name: "U.S. Virgin Islands", b: "1-VI-0", a: "1", c: "VI"}, {
            name: "Uganda",
            b: "256-UG-0",
            a: "256",
            c: "UG"
        }, {name: "Ukraine", b: "380-UA-0", a: "380", c: "UA"}, {
            name: "United Arab Emirates",
            b: "971-AE-0",
            a: "971",
            c: "AE"
        }, {name: "United Kingdom", b: "44-GB-0", a: "44", c: "GB"}, {
            name: "United States",
            b: "1-US-0",
            a: "1",
            c: "US"
        }, {name: "Uruguay", b: "598-UY-0", a: "598", c: "UY"}, {name: "Uzbekistan", b: "998-UZ-0", a: "998", c: "UZ"},
        {name: "Vanuatu", b: "678-VU-0", a: "678", c: "VU"}, {
            name: "Vatican City",
            b: "379-VA-0",
            a: "379",
            c: "VA"
        }, {name: "Venezuela", b: "58-VE-0", a: "58", c: "VE"}, {
            name: "Vietnam",
            b: "84-VN-0",
            a: "84",
            c: "VN"
        }, {name: "Wallis and Futuna", b: "681-WF-0", a: "681", c: "WF"}, {
            name: "Western Sahara",
            b: "212-EH-0",
            a: "212",
            c: "EH"
        }, {name: "Yemen", b: "967-YE-0", a: "967", c: "YE"}, {
            name: "Zambia",
            b: "260-ZM-0",
            a: "260",
            c: "ZM"
        }, {name: "Zimbabwe", b: "263-ZW-0", a: "263", c: "ZW"}];
    Th(Qh);
    var Uh = new Oh(Qh);

    function H(a, b) {
        var c = Mc(a, "firebaseui-textfield");
        b ? (Yd(a, "firebaseui-input-invalid"), Xd(a, "firebaseui-input"), c && Yd(c, "firebaseui-textfield-invalid")) : (Yd(a, "firebaseui-input"), Xd(a, "firebaseui-input-invalid"), c && Xd(c, "firebaseui-textfield-invalid"))
    }

    function Vh(a, b, c) {
        b = new zf(b);
        Sd(a, Ea(Td, b));
        ph(a).listen(b, "input", c)
    }

    function Wh(a, b, c) {
        b = new Cf(b);
        Sd(a, Ea(Td, b));
        ph(a).listen(b, "key", function (d) {
            13 == d.keyCode && (d.stopPropagation(), d.preventDefault(), c(d))
        })
    }

    function Xh(a, b, c) {
        b = new ef(b);
        Sd(a, Ea(Td, b));
        ph(a).listen(b, "focusin", c)
    }

    function Yh(a, b, c) {
        b = new ef(b);
        Sd(a, Ea(Td, b));
        ph(a).listen(b, "focusout", c)
    }

    function I(a, b, c) {
        b = new Xe(b);
        Sd(a, Ea(Td, b));
        ph(a).listen(b, "action", function (d) {
            d.stopPropagation();
            d.preventDefault();
            c(d)
        })
    }

    function Zh(a) {
        Xd(a, "firebaseui-hidden")
    }

    function $h(a, b) {
        b && Lc(a, b);
        Yd(a, "firebaseui-hidden")
    }

    function ai(a) {
        return !Wd(a, "firebaseui-hidden") && "none" != a.style.display
    };

    function bi(a) {
        ci(a, "upgradeElement")
    }

    function di(a) {
        ci(a, "downgradeElements")
    }

    var ei = ["mdl-js-textfield", "mdl-js-progress", "mdl-js-spinner", "mdl-js-button"];

    function ci(a, b) {
        a && window.componentHandler && window.componentHandler[b] && La(ei, function (c) {
            if (Wd(a, c)) window.componentHandler[b](a);
            La(Bc(c, a), function (d) {
                window.componentHandler[b](d)
            })
        })
    };

    function fi(a, b, c) {
        gi.call(this);
        document.body.appendChild(a);
        a.showModal || window.dialogPolyfill.registerDialog(a);
        a.showModal();
        bi(a);
        b && I(this, a, function (f) {
            var g = a.getBoundingClientRect();
            (f.clientX < g.left || g.left + g.width < f.clientX || f.clientY < g.top || g.top + g.height < f.clientY) && gi.call(this)
        });
        if (!c) {
            var d = this.fa().parentElement || this.fa().parentNode;
            if (d) {
                var e = this;
                this.sc = function () {
                    if (a.open) {
                        var f = a.getBoundingClientRect().height, g = d.getBoundingClientRect().height,
                            k = d.getBoundingClientRect().top -
                                document.body.getBoundingClientRect().top,
                            l = d.getBoundingClientRect().left - document.body.getBoundingClientRect().left,
                            n = a.getBoundingClientRect().width, m = d.getBoundingClientRect().width;
                        a.style.top = (k + (g - f) / 2).toString() + "px";
                        f = l + (m - n) / 2;
                        a.style.left = f.toString() + "px";
                        a.style.right = (document.body.getBoundingClientRect().width - f - n).toString() + "px"
                    } else window.removeEventListener("resize", e.sc)
                };
                this.sc();
                window.addEventListener("resize", this.sc, !1)
            }
        }
    }

    function gi() {
        var a = hi.call(this);
        a && (di(a), a.open && a.close(), Kc(a), this.sc && window.removeEventListener("resize", this.sc))
    }

    function hi() {
        return Dc("firebaseui-id-dialog")
    };

    function ii() {
        return "Enter a valid phone number"
    }

    function ji() {
        return "Something went wrong. Please try again."
    }

    function ki() {
        return "This email already exists without any means of sign-in. Please reset the password to recover."
    }

    function li(a) {
        a = a || {};
        var b = "";
        a = G(null == a.code || "string" === typeof a.code, "code", a.code, "null|string|undefined");
        switch (r(a) ? a.toString() : a) {
            case "invalid-argument":
                b += "Client specified an invalid argument.";
                break;
            case "invalid-configuration":
                b += "Client specified an invalid project configuration.";
                break;
            case "failed-precondition":
                b += "Request can not be executed in the current system state.";
                break;
            case "out-of-range":
                b += "Client specified an invalid range.";
                break;
            case "unauthenticated":
                b += "Request not authenticated due to missing, invalid, or expired OAuth token.";
                break;
            case "permission-denied":
                b += "Client does not have sufficient permission.";
                break;
            case "not-found":
                b += "Specified resource is not found.";
                break;
            case "aborted":
                b += "Concurrency conflict, such as read-modify-write conflict.";
                break;
            case "already-exists":
                b += "The resource that a client tried to create already exists.";
                break;
            case "resource-exhausted":
                b += "Either out of resource quota or reaching rate limiting.";
                break;
            case "cancelled":
                b += "Request cancelled by the client.";
                break;
            case "data-loss":
                b += "Unrecoverable data loss or data corruption.";
                break;
            case "unknown":
                b += "Unknown server error.";
                break;
            case "internal":
                b += "Internal server error.";
                break;
            case "not-implemented":
                b += "API method not implemented by the server.";
                break;
            case "unavailable":
                b += "Service unavailable.";
                break;
            case "deadline-exceeded":
                b += "Request deadline exceeded.";
                break;
            case "auth/user-disabled":
                b += "The user account has been disabled by an administrator.";
                break;
            case "auth/timeout":
                b += "The operation has timed out.";
                break;
            case "auth/too-many-requests":
                b += "We have blocked all requests from this device due to unusual activity. Try again later.";
                break;
            case "auth/quota-exceeded":
                b += "The quota for this operation has been exceeded. Try again later.";
                break;
            case "auth/network-request-failed":
                b += "A network error has occurred. Try again later.";
                break;
            case "restart-process":
                b += "An issue was encountered when authenticating your request. Please visit the URL that redirected you to this page again to restart the authentication process.";
                break;
            case "no-matching-tenant-for-email":
                b += "No sign-in provider is available for the given email, please try with a different email."
        }
        return b
    }

    function mi() {
        return "Please login again to perform this operation"
    };

    function ni() {
        return this.s("firebaseui-id-email")
    }

    function oi() {
        return this.s("firebaseui-id-email-error")
    }

    function pi(a) {
        var b = ni.call(this), c = oi.call(this);
        Vh(this, b, function () {
            ai(c) && (H(b, !0), Zh(c))
        });
        a && Wh(this, b, function () {
            a()
        })
    }

    function qi() {
        return ab(je(ni.call(this)) || "")
    }

    function ri() {
        var a = ni.call(this);
        var b = oi.call(this);
        var c = je(a) || "";
        c ? If.test(c) ? (H(a, !0), Zh(b), b = !0) : (H(a, !1), $h(b, "That email address isn't correct".toString()), b = !1) : (H(a, !1), $h(b, "Enter your email address to continue".toString()), b = !1);
        return b ? ab(je(a)) : null
    };

    function J() {
        return this.s("firebaseui-id-submit")
    }

    function K() {
        return this.s("firebaseui-id-secondary-link")
    }

    function si(a, b) {
        I(this, J.call(this), function (d) {
            a(d)
        });
        var c = K.call(this);
        c && b && I(this, c, function (d) {
            b(d)
        })
    };

    function ti(a) {
        a = a || {};
        var b = G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined"),
            c = G(null == a.disabled || "boolean" === typeof a.disabled || 1 === a.disabled || 0 === a.disabled, "disabled", a.disabled, "boolean|null|undefined"),
            d = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="email">';
        d = G(null == a.Dc || "boolean" === typeof a.Dc || 1 === a.Dc || 0 === a.Dc, "changeEmail", a.Dc, "boolean|null|undefined") ?
            d + "Enter new email address" : d + "Email";
        d += '</label><input type="email" name="email" autocomplete="username" class="mdl-textfield__input firebaseui-input firebaseui-id-email" value="' + yh(null != b ? b : "") + '"' + (c ? " disabled" : "") + '></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-email-error"></p></div>';
        return E(d)
    }

    function ui(a) {
        a = a || {};
        a = G(null == a.label || "string" === typeof a.label, "label", a.label, "null|string|undefined");
        var b = '<button type="submit" class="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">';
        b = a ? b + D(a) : b + "Next";
        return E(b + "</button>")
    }

    function vi() {
        var a = "" + ui({label: "Sign In"});
        return E(a)
    }

    function wi() {
        var a = "" + ui({label: "Save"});
        return E(a)
    }

    function xi() {
        var a = "" + ui({label: "Continue"});
        return E(a)
    }

    function yi(a) {
        a = a || {};
        a = G(null == a.label || "string" === typeof a.label, "label", a.label, "null|string|undefined");
        var b = '<div class="firebaseui-new-password-component"><div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="newPassword">';
        b = a ? b + D(a) : b + "Choose password";
        return E(b + '</label><input type="password" name="newPassword" autocomplete="new-password" class="mdl-textfield__input firebaseui-input firebaseui-id-new-password"></div><a href="javascript:void(0)" class="firebaseui-input-floating-button firebaseui-id-password-toggle firebaseui-input-toggle-on firebaseui-input-toggle-blur"></a><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-new-password-error"></p></div></div>')
    }

    function zi() {
        var a = {};
        var b = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="password">';
        b = G(null == a.current || "boolean" === typeof a.current || 1 === a.current || 0 === a.current, "current", a.current, "boolean|null|undefined") ? b + "Current password" : b + "Password";
        return E(b + '</label><input type="password" name="password" autocomplete="current-password" class="mdl-textfield__input firebaseui-input firebaseui-id-password"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-password-error"></p></div>')
    }

    function Ai() {
        return E('<a class="firebaseui-link firebaseui-id-secondary-link" href="javascript:void(0)">Trouble signing in?</a>')
    }

    function Bi(a) {
        a = a || {};
        a = G(null == a.label || "string" === typeof a.label, "label", a.label, "null|string|undefined");
        var b = '<button class="firebaseui-id-secondary-link firebaseui-button mdl-button mdl-js-button mdl-button--primary">';
        b = a ? b + D(a) : b + "Cancel";
        return E(b + "</button>")
    }

    function Ci(a) {
        var b = a.N, c = "";
        vh(a.O) && vh(b) && (c += '<ul class="firebaseui-tos-list firebaseui-tos"><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a></li><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a></li></ul>');
        return E(c)
    }

    function Di(a) {
        var b = a.N, c = "";
        vh(a.O) && vh(b) && (c += '<p class="firebaseui-tos firebaseui-tospp-full-message">By continuing, you are indicating that you accept our <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a> and <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a>.</p>');
        return E(c)
    }

    function Ei(a) {
        a = G("string" === typeof a.message, "message", a.message, "string");
        a = '<div class="firebaseui-info-bar firebaseui-id-info-bar"><p class="firebaseui-info-bar-message">' + D(a) + '&nbsp;&nbsp;<a href="javascript:void(0)" class="firebaseui-link firebaseui-id-dismiss-info-bar">';
        return E(a + "Dismiss</a></p></div>")
    }

    Ei.o = "firebaseui.auth.soy2.element.infoBar";

    function Fi(a) {
        var b = a.content;
        b = G("string" === typeof b || b instanceof Qg || b instanceof Sb, "content", a.content, "!goog.html.SafeHtml|!goog.soy.data.SanitizedHtml|!soydata.$$EMPTY_STRING_|string");
        a = G(null == a.Cd || "string" === typeof a.Cd, "classes", a.Cd, "null|string|undefined");
        return E('<dialog class="mdl-dialog firebaseui-dialog firebaseui-id-dialog' + (a ? " " + yh(a) : "") + '">' + D(b) + "</dialog>")
    }

    function Gi(a) {
        var b = G("string" === typeof a.fc, "iconClass", a.fc, "string");
        a = G("string" === typeof a.message, "message", a.message, "string");
        return E(Fi({content: wh('<div class="firebaseui-dialog-icon-wrapper"><div class="' + yh(b) + ' firebaseui-dialog-icon"></div></div><div class="firebaseui-progress-dialog-message">' + D(a) + "</div>")}))
    }

    Gi.o = "firebaseui.auth.soy2.element.progressDialog";

    function Hi(a) {
        a = G(za(a.items), "items", a.items, "!Array<{id: string, iconClass: string, label: string,}>");
        for (var b = '<div class="firebaseui-list-box-actions">', c = a.length, d = 0; d < c; d++) {
            var e = a[d];
            b += '<button type="button" data-listboxid="' + yh(e.id) + '" class="mdl-button firebaseui-id-list-box-dialog-button firebaseui-list-box-dialog-button">' + (e.fc ? '<div class="firebaseui-list-box-icon-wrapper"><div class="firebaseui-list-box-icon ' + yh(e.fc) + '"></div></div>' : "") + '<div class="firebaseui-list-box-label-wrapper">' +
                D(e.label) + "</div></button>"
        }
        a = "" + Fi({Cd: "firebaseui-list-box-dialog", content: wh(b + "</div>")});
        return E(a)
    }

    Hi.o = "firebaseui.auth.soy2.element.listBoxDialog";

    function Ii(a) {
        a = a || {};
        a = G(null == a.Pb || "boolean" === typeof a.Pb || 1 === a.Pb || 0 === a.Pb, "useSpinner", a.Pb, "boolean|null|undefined");
        return E(a ? '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>' : '<div class="mdl-progress mdl-js-progress mdl-progress__indeterminate firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>')
    }

    Ii.o = "firebaseui.auth.soy2.element.busyIndicator";

    function Ji(a, b) {
        a = a || {};
        a = G(null == a.G || r(a.G), "providerConfig", a.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
        b = b.Eg;
        return a.qf ? "" + a.qf : b[a.providerId] ? "" + b[a.providerId] : "" + a.providerId
    };

    function Ki() {
        Kc(Li.call(this))
    }

    function Li() {
        return this.s("firebaseui-id-info-bar")
    }

    function Mi() {
        return this.s("firebaseui-id-dismiss-info-bar")
    };

    function Ni(a, b, c) {
        var d = this;
        a = Tg(Hi, {items: a}, null, this.Bb());
        fi.call(this, a, !0, !0);
        c && (c = Oi(a, c)) && (c.focus(), jh(c, a));
        I(this, a, function (e) {
            if (e = (e = Mc(e.target, "firebaseui-id-list-box-dialog-button")) && $d(e, "listboxid")) gi.call(d), b(e)
        })
    }

    function Oi(a, b) {
        a = (a || document).getElementsByTagName("BUTTON");
        for (var c = 0; c < a.length; c++) if ($d(a[c], "listboxid") === b) return a[c];
        return null
    };

    function Pi() {
        return this.s("firebaseui-id-name")
    }

    function Qi() {
        return this.s("firebaseui-id-name-error")
    };

    function Ri() {
        return this.s("firebaseui-id-new-password")
    }

    function Si() {
        return this.s("firebaseui-id-password-toggle")
    }

    function Ti() {
        this.Sd = !this.Sd;
        var a = Si.call(this), b = Ri.call(this);
        this.Sd ? (b.type = "text", Xd(a, "firebaseui-input-toggle-off"), Yd(a, "firebaseui-input-toggle-on")) : (b.type = "password", Xd(a, "firebaseui-input-toggle-on"), Yd(a, "firebaseui-input-toggle-off"));
        b.focus()
    }

    function Ui() {
        return this.s("firebaseui-id-new-password-error")
    }

    function Vi() {
        this.Sd = !1;
        var a = Ri.call(this);
        a.type = "password";
        var b = Ui.call(this);
        Vh(this, a, function () {
            ai(b) && (H(a, !0), Zh(b))
        });
        var c = Si.call(this);
        Xd(c, "firebaseui-input-toggle-on");
        Yd(c, "firebaseui-input-toggle-off");
        Xh(this, a, function () {
            Xd(c, "firebaseui-input-toggle-focus");
            Yd(c, "firebaseui-input-toggle-blur")
        });
        Yh(this, a, function () {
            Xd(c, "firebaseui-input-toggle-blur");
            Yd(c, "firebaseui-input-toggle-focus")
        });
        I(this, c, t(Ti, this))
    }

    function Wi() {
        var a = Ri.call(this);
        var b = Ui.call(this);
        je(a) ? (H(a, !0), Zh(b), b = !0) : (H(a, !1), $h(b, "Enter your password".toString()), b = !1);
        return b ? je(a) : null
    };

    function Xi() {
        return this.s("firebaseui-id-password")
    }

    function Yi() {
        return this.s("firebaseui-id-password-error")
    }

    function Zi() {
        var a = Xi.call(this), b = Yi.call(this);
        Vh(this, a, function () {
            ai(b) && (H(a, !0), Zh(b))
        })
    }

    function $i() {
        var a = Xi.call(this);
        var b = Yi.call(this);
        je(a) ? (H(a, !0), Zh(b), b = !0) : (H(a, !1), $h(b, "Enter your password".toString()), b = !1);
        return b ? je(a) : null
    };

    function aj() {
        return this.s("firebaseui-id-phone-confirmation-code")
    }

    function bj() {
        return this.s("firebaseui-id-phone-confirmation-code-error")
    };

    function cj(a, b) {
        this.Fc = a;
        this.Oa = b
    }

    function dj(a) {
        a = ab(a);
        var b = Uh.search(a);
        return 0 < b.length ? new cj("1" == b[0].a ? "1-US-0" : b[0].b, ab(a.substr(b[0].a.length + 1))) : null
    }

    function ej(a) {
        var b = Ph(a.Fc);
        if (!b) throw Error("Country ID " + a.Fc + " not found.");
        return "+" + b.a + a.Oa
    };

    function fj() {
        return this.s("firebaseui-id-phone-number")
    }

    function gj() {
        return this.s("firebaseui-id-country-selector")
    }

    function hj() {
        return this.s("firebaseui-id-phone-number-error")
    }

    function ij(a, b) {
        var c = a.Sa, d = jj("1-US-0", c);
        b = b && jj(b, c) ? b : d ? "1-US-0" : 0 < c.length ? c[0].b : null;
        if (!b) throw Error("No available default country");
        kj.call(this, b, a)
    }

    function jj(a, b) {
        a = Ph(a);
        return !(!a || !Ra(b, a))
    }

    function lj(a) {
        return Oa(a, function (b) {
            return {id: b.b, fc: "firebaseui-flag " + mj(b), label: b.name + " \u200e+" + b.a}
        })
    }

    function mj(a) {
        return "firebaseui-flag-" + a.c
    }

    function nj(a) {
        var b = this;
        Ni.call(this, lj(a.Sa), function (c) {
            kj.call(b, c, a, !0);
            b.ib().focus()
        }, this.rc)
    }

    function kj(a, b, c) {
        var d = Ph(a);
        d && (c && (c = ab(je(fj.call(this)) || ""), b = b.search(c), b.length && b[0].a != d.a && (c = "+" + d.a + c.substr(b[0].a.length + 1), ke(fj.call(this), c))), b = Ph(this.rc), this.rc = a, a = this.s("firebaseui-id-country-selector-flag"), b && Yd(a, mj(b)), Xd(a, mj(d)), Lc(this.s("firebaseui-id-country-selector-code"), "\u200e+" + d.a))
    };

    function oj() {
        return this.s("firebaseui-id-resend-countdown")
    };var pj = {}, qj = 0;

    function rj(a, b) {
        if (!a) throw Error("Event target element must be provided!");
        a = sj(a);
        if (pj[a] && pj[a].length) for (var c = 0; c < pj[a].length; c++) pj[a][c].dispatchEvent(b)
    }

    function tj(a) {
        var b = sj(a.fa());
        pj[b] && pj[b].length && (Ua(pj[b], function (c) {
            return c == a
        }), pj[b].length || delete pj[b])
    }

    function sj(a) {
        "undefined" === typeof a.Ke && (a.Ke = qj, qj++);
        return a.Ke
    }

    function uj(a) {
        if (!a) throw Error("Event target element must be provided!");
        Qe.call(this);
        this.Fg = a
    }

    p(uj, Qe);
    uj.prototype.fa = function () {
        return this.Fg
    };
    uj.prototype.register = function () {
        var a = sj(this.fa());
        pj[a] ? Ra(pj[a], this) || pj[a].push(this) : pj[a] = [this]
    };
    uj.prototype.unregister = function () {
        tj(this)
    };
    var vj = {
        Dg: {
            "google.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
            "github.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg",
            "facebook.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg",
            "twitter.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/twitter.svg",
            password: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg",
            phone: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/phone.svg",
            anonymous: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/anonymous.png",
            "microsoft.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg",
            "yahoo.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/yahoo.svg",
            "apple.com": "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.png"
        },
        Cg: {
            "google.com": "#ffffff",
            "github.com": "#333333",
            "facebook.com": "#3b5998",
            "twitter.com": "#55acee",
            password: "#db4437",
            phone: "#02bd7e",
            anonymous: "#f4b400",
            "microsoft.com": "#2F2F2F",
            "yahoo.com": "#720E9E",
            "apple.com": "#000000"
        },
        Eg: {
            "google.com": "Google",
            "github.com": "GitHub",
            "facebook.com": "Facebook",
            "twitter.com": "Twitter",
            password: "Password",
            phone: "Phone",
            anonymous: "Guest",
            "microsoft.com": "Microsoft",
            "yahoo.com": "Yahoo",
            "apple.com": "Apple"
        }
    };

    function wj(a, b, c) {
        pe.call(this, a, b);
        for (var d in c) this[d] = c[d]
    }

    x(wj, pe);

    function L(a, b, c, d, e) {
        oh.call(this, c);
        this.Af = a;
        this.zf = b;
        this.Uc = !1;
        this.Wd = d || null;
        this.Ra = this.Ea = null;
        this.Db = pb(vj);
        rb(this.Db, e || {})
    }

    x(L, oh);
    h = L.prototype;
    h.Dd = function () {
        var a = Tg(this.Af, this.zf, this.Db, this.Bb());
        bi(a);
        this.f = a
    };
    h.j = function () {
        L.Z.j.call(this);
        rj(M(this), new wj("pageEnter", M(this), {pageId: this.Wd}));
        if (this.Ue() && this.Db.O) {
            var a = this.Db.O;
            I(this, this.Ue(), function () {
                a()
            })
        }
        if (this.Te() && this.Db.N) {
            var b = this.Db.N;
            I(this, this.Te(), function () {
                b()
            })
        }
    };
    h.$b = function () {
        rj(M(this), new wj("pageExit", M(this), {pageId: this.Wd}));
        L.Z.$b.call(this)
    };
    h.h = function () {
        window.clearTimeout(this.Ea);
        this.zf = this.Af = this.Ea = null;
        this.Uc = !1;
        this.Ra = null;
        di(this.fa());
        L.Z.h.call(this)
    };

    function xj(a) {
        a.Uc = !0;
        var b = Wd(a.fa(), "firebaseui-use-spinner");
        a.Ea = window.setTimeout(function () {
            a.fa() && null === a.Ra && (a.Ra = Tg(Ii, {Pb: b}, null, a.Bb()), a.fa().appendChild(a.Ra), bi(a.Ra))
        }, 500)
    }

    h.aa = function (a, b, c, d) {
        function e() {
            if (f.isDisposed()) return null;
            f.Uc = !1;
            window.clearTimeout(f.Ea);
            f.Ea = null;
            f.Ra && (di(f.Ra), Kc(f.Ra), f.Ra = null)
        }

        var f = this;
        if (f.Uc) return null;
        xj(f);
        return a.apply(null, b).then(c, d).then(e, e)
    };

    function M(a) {
        return a.fa().parentElement || a.fa().parentNode
    }

    function yj(a, b, c) {
        Wh(a, b, function () {
            c.focus()
        })
    }

    function zj(a, b, c) {
        Wh(a, b, function () {
            c()
        })
    }

    v(L.prototype, {
        H: function (a) {
            Ki.call(this);
            var b = Tg(Ei, {message: a}, null, this.Bb());
            this.fa().appendChild(b);
            I(this, Mi.call(this), function () {
                Kc(b)
            })
        }, si: Ki, wi: Li, vi: Mi, Lb: function (a, b) {
            a = Tg(Gi, {fc: a, message: b}, null, this.Bb());
            fi.call(this, a)
        }, da: gi, Og: hi, yi: function () {
            return this.s("firebaseui-tos")
        }, Ue: function () {
            return this.s("firebaseui-tos-link")
        }, Te: function () {
            return this.s("firebaseui-pp-link")
        }, zi: function () {
            return this.s("firebaseui-tos-list")
        }
    });

    function Aj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined");
        c = G(null == a.xa || "boolean" === typeof a.xa || 1 === a.xa || 0 === a.xa, "displayCancelButton", a.xa, "boolean|null|undefined");
        var d = G(null == a.L || "boolean" === typeof a.L || 1 === a.L || 0 === a.L, "displayFullTosPpMessage", a.L, "boolean|null|undefined");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in with email</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
            (D(ti(a)) + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (c ? D(Bi(null)) : "") + D(ui(null)) + '</div></div><div class="firebaseui-card-footer">' + (d ? D(Di(b)) : D(Ci(b))) + "</div></form></div>");
        return E(a)
    }

    Aj.o = "firebaseui.auth.soy2.page.signIn";

    function Bj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined");
        c = G(null == a.L || "boolean" === typeof a.L || 1 === a.L || 0 === a.L, "displayFullTosPpMessage", a.L, "boolean|null|undefined");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in' + ('</h1></div><div class="firebaseui-card-content">' + D(ti(a)) + D(zi()) +
            '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + D(Ai()) + '</div><div class="firebaseui-form-actions">' + D(vi()) + '</div></div><div class="firebaseui-card-footer">' + (c ? D(Di(b)) : D(Ci(b))) + "</div></form></div>");
        return E(a)
    }

    Bj.o = "firebaseui.auth.soy2.page.passwordSignIn";

    function Cj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined");
        var d = G(null == a.tc || "boolean" === typeof a.tc || 1 === a.tc || 0 === a.tc, "requireDisplayName", a.tc, "boolean|null|undefined");
        G(null == a.name || "string" === typeof a.name, "name", a.name, "null|string|undefined");
        c = G(null == a.ta || "boolean" === typeof a.ta || 1 === a.ta || 0 === a.ta, "allowCancel", a.ta, "boolean|null|undefined");
        var e = G(null == a.L || "boolean" === typeof a.L || 1 === a.L || 0 === a.L, "displayFullTosPpMessage",
            a.L, "boolean|null|undefined"), f = '</h1></div><div class="firebaseui-card-content">' + D(ti(a));
        d ? (a = a || {}, a = G(null == a.name || "string" === typeof a.name, "name", a.name, "null|string|undefined"), a = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="name">First &amp; last name</label><input type="text" name="name" autocomplete="name" class="mdl-textfield__input firebaseui-input firebaseui-id-name" value="' +
            (yh(null != a ? a : "") + '"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-name-error"></p></div>'), a = E(a), a = D(a)) : a = "";
        b = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-up"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Create account' + (f + a + D(yi(null)) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
            (c ? D(Bi(null)) : "") + D(wi()) + '</div></div><div class="firebaseui-card-footer">' + (e ? D(Di(b)) : D(Ci(b))) + "</div></form></div>");
        return E(b)
    }

    Cj.o = "firebaseui.auth.soy2.page.passwordSignUp";

    function Dj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined");
        c = G(null == a.ta || "boolean" === typeof a.ta || 1 === a.ta || 0 === a.ta, "allowCancel", a.ta, "boolean|null|undefined");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Recover password</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Get instructions sent to this email that explain how to reset your password</p>' + (D(ti(a)) +
            '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (c ? D(Bi(null)) : ""));
        a += D(ui({label: "Send"}));
        a += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(a)
    }

    Dj.o = "firebaseui.auth.soy2.page.passwordRecovery";

    function Ej(a, b, c) {
        b = c || b;
        c = G("string" === typeof a.email, "email", a.email, "string");
        a = G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined");
        var d = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery-email-sent"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Check your email</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">';
        c = "Follow the instructions sent to <strong>" +
            (D(c) + "</strong> to recover your password");
        d = d + c + '</p></div><div class="firebaseui-card-actions">';
        a && (d = d + '<div class="firebaseui-form-actions">' + D(ui({label: "Done"})), d += "</div>");
        d += '</div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></div>";
        return E(d)
    }

    Ej.o = "firebaseui.auth.soy2.page.passwordRecoveryEmailSent";

    function Fj(a, b, c) {
        return E('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-callback"><div class="firebaseui-callback-indicator-container">' + D(Ii(null, c || b)) + "</div></div>")
    }

    Fj.o = "firebaseui.auth.soy2.page.callback";

    function Gj(a, b, c) {
        return E('<div class="firebaseui-container firebaseui-id-page-spinner">' + D(Ii({Pb: !0}, c || b)) + "</div>")
    }

    Gj.o = "firebaseui.auth.soy2.page.spinner";

    function Hj() {
        return E('<div class="firebaseui-container firebaseui-id-page-blank firebaseui-use-spinner"></div>')
    }

    Hj.o = "firebaseui.auth.soy2.page.blank";

    function Ij(a, b, c) {
        b = c || b;
        c = G("string" === typeof a.email, "email", a.email, "string");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-sent"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign-in email sent</h1></div><div class="firebaseui-card-content"><div class="firebaseui-email-sent"></div><p class="firebaseui-text">';
        c = "A sign-in email with additional instructions was sent to <strong>" + (D(c) + "</strong>. Check your email to complete sign-in.");
        a += c;
        c = E('<a class="firebaseui-link firebaseui-id-trouble-getting-email-link" href="javascript:void(0)">Trouble getting email?</a>');
        a += '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + D(c) + '</div><div class="firebaseui-form-actions">';
        a += D(Bi({label: "Back"}));
        a += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(a)
    }

    Ij.o = "firebaseui.auth.soy2.page.emailLinkSignInSent";

    function Jj(a, b, c) {
        b = c || b;
        a = E('<a class="firebaseui-link firebaseui-id-resend-email-link" href="javascript:void(0)">Resend</a>');
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-not-received"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Trouble getting email?</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Try these common fixes:<ul><li>Check if the email was marked as spam or filtered.</li><li>Check your internet connection.</li><li>Check that you did not misspell your email.</li><li>Check that your inbox space is not running out or other inbox settings related issues.</li></ul></p><p class="firebaseui-text">If the steps above didn\'t work, you can resend the email. Note that this will deactivate the link in the older email.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
            (D(a) + '</div><div class="firebaseui-form-actions">');
        a += D(Bi({label: "Back"}));
        a += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(a)
    }

    Jj.o = "firebaseui.auth.soy2.page.emailNotReceived";

    function Kj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.email || "string" === typeof a.email, "email", a.email, "null|string|undefined");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-confirmation"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Confirm email</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Confirm your email to complete sign in</p><div class="firebaseui-relative-wrapper">' + (D(ti(a)) +
            '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(Bi(null)) + D(ui(null)) + '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>");
        return E(a)
    }

    Kj.o = "firebaseui.auth.soy2.page.emailLinkSignInConfirmation";

    function Lj() {
        var a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-different-device-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">New device or browser detected</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Try opening the link using the same device or browser where you started the sign-in process.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(Bi({label: "Dismiss"}));
        return E(a +
            "</div></div></div>")
    }

    Lj.o = "firebaseui.auth.soy2.page.differentDeviceError";

    function Mj() {
        var a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-anonymous-user-mismatch"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Session ended</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">The session associated with this sign-in request has either expired or was cleared.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(Bi({label: "Dismiss"}));
        return E(a + "</div></div></div>")
    }

    Mj.o = "firebaseui.auth.soy2.page.anonymousUserMismatch";

    function Nj(a, b, c) {
        b = c || b;
        c = G("string" === typeof a.email, "email", a.email, "string");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text">';
        c = "You\u2019ve already used <strong>" + (D(c) + "</strong> to sign in. Enter your password for that account.");
        a = a + c + ("</p>" + D(zi()) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + D(Ai()) + '</div><div class="firebaseui-form-actions">' + D(vi()) + '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>");
        return E(a)
    }

    Nj.o = "firebaseui.auth.soy2.page.passwordLinking";

    function Oj(a, b, c) {
        b = c || b;
        var d = G("string" === typeof a.email, "email", a.email, "string");
        G(null == a.G || r(a.G), "providerConfig", a.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
        c = "";
        a = "" + Ji(a, b);
        c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text firebaseui-text-justify">';
        d = "You\u2019ve already used <strong>" + (D(d) + ("</strong>. You can connect your <strong>" + (D(a) + ("</strong> account with <strong>" + (D(d) + "</strong> by signing in with email link below.")))));
        c = c + d + '<p class="firebaseui-text firebaseui-text-justify">';
        a = "For this flow to successfully connect your " + (D(a) + " account with this email, you have to open the link on the same device or browser.");
        c = c + a + ('</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(vi()) + '</div></div><div class="firebaseui-card-footer">' +
            D(Ci(b)) + "</div></form></div>");
        return E(c)
    }

    Oj.o = "firebaseui.auth.soy2.page.emailLinkSignInLinking";

    function Pj(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.G || r(a.G), "providerConfig", a.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
        c = "";
        a = "" + Ji(a, b);
        c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking-different-device"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text firebaseui-text-justify">';
        var d =
            "You originally intended to connect <strong>" + (D(a) + "</strong> to your email account but have opened the link on a different device where you are not signed in.");
        c = c + d + '</p><p class="firebaseui-text firebaseui-text-justify">';
        a = "If you still want to connect your <strong>" + (D(a) + "</strong> account, open the link on the same device where you started sign-in. Otherwise, tap Continue to sign-in on this device.");
        c = c + a + ('</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
            D(xi()) + '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>");
        return E(c)
    }

    Pj.o = "firebaseui.auth.soy2.page.emailLinkSignInLinkingDifferentDevice";

    function Qj(a, b, c) {
        b = c || b;
        var d = G("string" === typeof a.email, "email", a.email, "string");
        G(null == a.G || r(a.G), "providerConfig", a.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
        c = "";
        a = "" + Ji(a, b);
        c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-federated-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text">';
        d =
            "You\u2019ve already used <strong>" + (D(d) + ("</strong>. Sign in with " + (D(a) + " to continue.")));
        c = c + d + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(ui({label: "Sign in with " + a}));
        c += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(c)
    }

    Qj.o = "firebaseui.auth.soy2.page.federatedLinking";

    function Rj(a, b, c) {
        b = c || b;
        c = G("string" === typeof a.email, "email", a.email, "string");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unsupported-provider"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">';
        c = "To continue sign in with <strong>" + (D(c) + "</strong> on this device, you have to recover the password.");
        a = a + c + ('</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
            D(Bi(null)));
        a += D(ui({label: "Recover password"}));
        a += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(a)
    }

    Rj.o = "firebaseui.auth.soy2.page.unsupportedProvider";

    function Sj(a) {
        var b = G("string" === typeof a.email, "email", a.email, "string");
        var c = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Reset your password</h1></div><div class="firebaseui-card-content">';
        b = '<p class="firebaseui-text">for <strong>' + (D(b) + "</strong></p>");
        var d = {label: "New password"}, e;
        for (e in a) e in d || (d[e] = a[e]);
        c = c + b + D(yi(d));
        c += '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
            D(wi()) + "</div></div></form></div>";
        return E(c)
    }

    Sj.o = "firebaseui.auth.soy2.page.passwordReset";

    function Tj(a) {
        a = a || {};
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Password changed</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You can now sign in with your new password</p></div><div class="firebaseui-card-actions">' + ((G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined") ? '<div class="firebaseui-form-actions">' +
            D(xi()) + "</div>" : "") + "</div></div>");
        return E(a)
    }

    Tj.o = "firebaseui.auth.soy2.page.passwordResetSuccess";

    function Uj(a) {
        a = a || {};
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Try resetting your password again</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Your request to reset your password has expired or the link has already been used</p></div><div class="firebaseui-card-actions">' + ((G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue",
            a.l, "boolean|null|undefined") ? '<div class="firebaseui-form-actions">' + D(xi()) + "</div>" : "") + "</div></div>");
        return E(a)
    }

    Uj.o = "firebaseui.auth.soy2.page.passwordResetFailure";

    function Vj(a) {
        var b = G("string" === typeof a.email, "email", a.email, "string");
        a = G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined");
        var c = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Updated email address</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">';
        b = "Your sign-in email address has been changed back to <strong>" +
            (D(b) + "</strong>.");
        c = c + b + '</p><p class="firebaseui-text">If you didn\u2019t ask to change your sign-in email, it\u2019s possible someone is trying to access your account and you should <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">change your password right away</a>.';
        c += '</p></div><div class="firebaseui-card-actions">' + (a ? '<div class="firebaseui-form-actions">' + D(xi()) + "</div>" : "") + "</div></form></div>";
        return E(c)
    }

    Vj.o = "firebaseui.auth.soy2.page.emailChangeRevokeSuccess";

    function Wj(a) {
        a = a || {};
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Unable to update your email address</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">There was a problem changing your sign-in email back.</p><p class="firebaseui-text">If you try again and still can\u2019t reset your email, try asking your administrator for help.</p></div><div class="firebaseui-card-actions">' +
            ((G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined") ? '<div class="firebaseui-form-actions">' + D(xi()) + "</div>" : "") + "</div></div>");
        return E(a)
    }

    Wj.o = "firebaseui.auth.soy2.page.emailChangeRevokeFailure";

    function Xj(a) {
        a = a || {};
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Your email has been verified</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You can now sign in with your new account</p></div><div class="firebaseui-card-actions">' + ((G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined") ? '<div class="firebaseui-form-actions">' +
            D(xi()) + "</div>" : "") + "</div></div>");
        return E(a)
    }

    Xj.o = "firebaseui.auth.soy2.page.emailVerificationSuccess";

    function Yj(a) {
        a = a || {};
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Try verifying your email again</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Your request to verify your email has expired or the link has already been used</p></div><div class="firebaseui-card-actions">' + ((G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue",
            a.l, "boolean|null|undefined") ? '<div class="firebaseui-form-actions">' + D(xi()) + "</div>" : "") + "</div></div>");
        return E(a)
    }

    Yj.o = "firebaseui.auth.soy2.page.emailVerificationFailure";

    function Zj(a) {
        var b = G("string" === typeof a.factorId, "factorId", a.factorId, "string"),
            c = G(null == a.phoneNumber || "string" === typeof a.phoneNumber, "phoneNumber", a.phoneNumber, "null|string|undefined");
        a = G(null == a.l || "boolean" === typeof a.l || 1 === a.l || 0 === a.l, "allowContinue", a.l, "boolean|null|undefined");
        var d = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-revert-second-factor-addition-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Removed second factor</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">';
        switch (r(b) ?
            b.toString() : b) {
            case "phone":
                b = "The <strong>" + (D(b) + (" " + (D(c) + "</strong> was removed as a second authentication step.")));
                d += b;
                break;
            default:
                d += "The device or app was removed as a second authentication step."
        }
        d = d + '</p><p class="firebaseui-text">If you don\'t recognize this device, someone might be trying to access your account. Consider <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">changing your password right away</a>.</p></div><div class="firebaseui-card-actions">' +
            ((a ? '<div class="firebaseui-form-actions">' + D(xi()) + "</div>" : "") + "</div></form></div>");
        return E(d)
    }

    Zj.o = "firebaseui.auth.soy2.page.revertSecondFactorAdditionSuccess";

    function ak(a) {
        var b = G("string" === typeof a.errorMessage, "errorMessage", a.errorMessage, "string");
        a = G(null == a.Sb || "boolean" === typeof a.Sb || 1 === a.Sb || 0 === a.Sb, "allowRetry", a.Sb, "boolean|null|undefined");
        b = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-recoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Error encountered</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + (D(b) + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">');
        a && (b += D(ui({label: "Retry"})));
        return E(b + "</div></div></div>")
    }

    ak.o = "firebaseui.auth.soy2.page.recoverableError";

    function bk(a) {
        a = G("string" === typeof a.errorMessage, "errorMessage", a.errorMessage, "string");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unrecoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Error encountered</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + (D(a) + "</p></div></div>");
        return E(a)
    }

    bk.o = "firebaseui.auth.soy2.page.unrecoverableError";

    function ck(a, b, c) {
        b = c || b;
        c = G("string" === typeof a.Kf, "userEmail", a.Kf, "string");
        var d = G("string" === typeof a.lf, "pendingEmail", a.lf, "string");
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-mismatch"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">';
        c = "Continue with " + (D(c) + "?");
        a = a + c + '</h2><p class="firebaseui-text">';
        c = "You originally wanted to sign in with " +
            D(d);
        a = a + c + ('</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(Bi(null)));
        a += D(ui({label: "Continue"}));
        a += '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form></div>";
        return E(a)
    }

    ck.o = "firebaseui.auth.soy2.page.emailMismatch";

    function dk(a, b, c) {
        b = c || b;
        a = G(za(a.nf), "providerConfigs", a.nf, "!Array<{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}>");
        var d = '<div class="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-idp-list">';
        c = a.length;
        for (var e = 0; e < c; e++) {
            var f = {G: a[e]};
            var g = b;
            f = f || {};
            var k = G(null == f.G || r(f.G), "providerConfig", f.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}"),
                l = f;
            l = l || {};
            var n = "";
            l = G(null == l.G || r(l.G), "providerConfig", l.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}").providerId;
            switch (r(l) ? l.toString() : l) {
                case "google.com":
                    n +=
                        "firebaseui-idp-google";
                    break;
                case "github.com":
                    n += "firebaseui-idp-github";
                    break;
                case "facebook.com":
                    n += "firebaseui-idp-facebook";
                    break;
                case "twitter.com":
                    n += "firebaseui-idp-twitter";
                    break;
                case "phone":
                    n += "firebaseui-idp-phone";
                    break;
                case "anonymous":
                    n += "firebaseui-idp-anonymous";
                    break;
                case "password":
                    n += "firebaseui-idp-password";
                    break;
                default:
                    n += "firebaseui-idp-generic"
            }
            n = '<button class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised ' + yh(n) + ' firebaseui-id-idp-button" data-provider-id="' +
                yh(k.providerId) + '" style="background-color:';
            var m = f;
            l = g;
            m = m || {};
            m = G(null == m.G || r(m.G), "providerConfig", m.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
            l = l.Cg;
            n = n + yh(Kh(m.Ac ? "" + m.Ac : l[m.providerId] ? "" + l[m.providerId] : "" + l.password)) + '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="';
            m = f;
            l = g;
            m = m || {};
            m = G(null == m.G || r(m.G), "providerConfig",
                m.G, "null|undefined|{providerId: (null|string|undefined), providerName: (null|string|undefined), buttonColor: (null|string|undefined), iconUrl: (null|string|undefined),}");
            l = l.Dg;
            l = m.Tc ? Dh(m.Tc) : l[m.providerId] ? Dh(l[m.providerId]) : Dh(l.password);
            l = th(l);
            n = n + yh(Ih(l)) + '"></span>';
            uh(k.providerId, "password") ? n += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Sign in with email</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Email</span>' : uh(k.providerId, "phone") ? n += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Sign in with phone</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Phone</span>' :
                uh(k.providerId, "anonymous") ? n += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Continue as guest</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Guest</span>' : (n += '<span class="firebaseui-idp-text firebaseui-idp-text-long">', k = "Sign in with " + D(Ji(f, g)), n = n + k + ('</span><span class="firebaseui-idp-text firebaseui-idp-text-short">' + D(Ji(f, g)) + "</span>"));
            n += "</button>";
            f = E(n);
            d += '<li class="firebaseui-list-item">' + D(f) + "</li>"
        }
        d += '</ul></form></div><div class="firebaseui-card-footer firebaseui-provider-sign-in-footer">' +
            D(Di(b)) + "</div></div>";
        return E(d)
    }

    dk.o = "firebaseui.auth.soy2.page.providerSignIn";

    function ek(a, b, c) {
        b = c || b;
        a = a || {};
        G(null == a.Oa || "string" === typeof a.Oa, "nationalNumber", a.Oa, "null|string|undefined");
        var d = G(null == a.Zb || "boolean" === typeof a.Zb || 1 === a.Zb || 0 === a.Zb, "enableVisibleRecaptcha", a.Zb, "boolean|null|undefined"),
            e = G(null == a.xa || "boolean" === typeof a.xa || 1 === a.xa || 0 === a.xa, "displayCancelButton", a.xa, "boolean|null|undefined");
        c = G(null == a.L || "boolean" === typeof a.L || 1 === a.L || 0 === a.L, "displayFullTosPpMessage", a.L, "boolean|null|undefined");
        a = a || {};
        a = G(null == a.Oa || "string" === typeof a.Oa,
            "nationalNumber", a.Oa, "null|string|undefined");
        a = '<div class="firebaseui-phone-number"><button class="firebaseui-id-country-selector firebaseui-country-selector mdl-button mdl-js-button"><span class="firebaseui-flag firebaseui-country-selector-flag firebaseui-id-country-selector-flag"></span><span class="firebaseui-id-country-selector-code"></span></button><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label firebaseui-textfield firebaseui-phone-input-wrapper"><label class="mdl-textfield__label firebaseui-label" for="phoneNumber">Phone number</label><input type="tel" name="phoneNumber" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-number" value="' +
            (yh(null != a ? a : "") + '"></div></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-phone-number-error firebaseui-id-phone-number-error"></p></div>');
        a = E(a);
        a = '</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' + D(a);
        d ? (d = E('<div class="firebaseui-recaptcha-wrapper"><div class="firebaseui-recaptcha-container"></div><div class="firebaseui-error-wrapper firebaseui-recaptcha-error-wrapper"><p class="firebaseui-error firebaseui-hidden firebaseui-id-recaptcha-error"></p></div></div>'),
            d = D(d)) : d = "";
        e = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-start"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Enter your phone number' + (a + d + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (e ? D(Bi(null)) : ""));
        e += D(ui({label: "Verify"}));
        c ? (c = b.N, d = '<p class="firebaseui-tos firebaseui-phone-tos">', d = vh(b.O) && vh(c) ? d + 'By tapping Verify, you are indicating that you accept our <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a> and <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a>. An SMS may be sent. Message &amp; data rates may apply.' :
            d + "By tapping Verify, an SMS may be sent. Message &amp; data rates may apply.", b = E(d + "</p>"), b = D(b)) : (c = E('<p class="firebaseui-tos firebaseui-phone-sms-notice">By tapping Verify, an SMS may be sent. Message &amp; data rates may apply.</p>'), b = D(c) + D(Ci(b)));
        return E(e + ('</div></div><div class="firebaseui-card-footer">' + b + "</div></form></div>"))
    }

    ek.o = "firebaseui.auth.soy2.page.phoneSignInStart";

    function fk(a, b, c) {
        b = c || b;
        a = a || {};
        a = G(null == a.phoneNumber || "string" === typeof a.phoneNumber, "phoneNumber", a.phoneNumber, "null|string|undefined");
        c = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-finish"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Verify your phone number</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">';
        var d = 'Enter the 6-digit code we sent to <a class="firebaseui-link firebaseui-change-phone-number-link firebaseui-id-change-phone-number-link" href="javascript:void(0)">&lrm;' +
            (D(a) + "</a>");
        D(a);
        a = c + d;
        c = E('<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="phoneConfirmationCode">6-digit code</label><input type="number" name="phoneConfirmationCode" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-confirmation-code"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-phone-confirmation-code-error"></p></div>');
        c = a + ("</p>" + D(c) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(Bi(null)));
        a = c += D(ui({label: "Continue"}));
        b = '</div></div><div class="firebaseui-card-footer">' + D(Ci(b)) + "</div></form>";
        c = E('<div class="firebaseui-resend-container"><span class="firebaseui-id-resend-countdown"></span><a href="javascript:void(0)" class="firebaseui-id-resend-link firebaseui-hidden firebaseui-link">Resend</a></div>');
        c = a + (b + D(c) + "</div>");
        return E(c)
    }

    fk.o = "firebaseui.auth.soy2.page.phoneSignInFinish";

    function gk() {
        return E('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-out"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign Out</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You are now successfully signed out.</p></div></div>')
    }

    gk.o = "firebaseui.auth.soy2.page.signOut";

    function hk(a, b, c) {
        b = c || b;
        a = G(za(a.Bf), "tenantConfigs", a.Bf, "!Array<{tenantId: (null|string|undefined), displayName: string, buttonColor: string, iconUrl: string,}>");
        var d = '<div class="firebaseui-container firebaseui-page-select-tenant firebaseui-id-page-select-tenant"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-tenant-list">';
        c = a.length;
        for (var e = 0; e < c; e++) {
            var f = a[e];
            var g = G(r(f), "tenantConfig", f, "{tenantId: (null|string|undefined), displayName: string, buttonColor: string, iconUrl: string,}");
            f = '<button class="firebaseui-tenant-button mdl-button mdl-js-button mdl-button--raised firebaseui-tenant-selection-' + yh(g.tenantId ? "" + g.tenantId : "top-level-project") + ' firebaseui-id-tenant-selection-button"' + (g.tenantId ? ' data-tenant-id="' + yh(g.tenantId) + '"' : "") + ' style="background-color:' + yh(Kh(g.Ac)) + '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="' + yh(Ih(g.Tc)) + '"></span><span class="firebaseui-idp-text firebaseui-idp-text-long">';
            var k = "Sign in to " + D(g.displayName);
            f = f + k + '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">';
            g = D(g.displayName);
            f += g;
            f += "</span></button>";
            f = E(f);
            d += '<li class="firebaseui-list-item">' + D(f) + "</li>"
        }
        d += '</ul></form></div><div class="firebaseui-card-footer firebaseui-provider-sign-in-footer">' + D(Di(b)) + "</div></div>";
        return E(d)
    }

    hk.o = "firebaseui.auth.soy2.page.selectTenant";

    function ik(a, b, c) {
        b = c || b;
        a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-provider-match-by-email"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' + (D(ti(null)) + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + D(ui(null)) + '</div></div><div class="firebaseui-card-footer">' + D(Di(b)) + "</div></form></div>");
        return E(a)
    }

    ik.o = "firebaseui.auth.soy2.page.providerMatchByEmail";

    function jk(a, b) {
        L.call(this, Mj, void 0, b, "anonymousUserMismatch");
        this.lc = a
    }

    p(jk, L);
    jk.prototype.j = function () {
        var a = this;
        I(this, this.I(), function () {
            a.lc()
        });
        this.I().focus();
        L.prototype.j.call(this)
    };
    jk.prototype.h = function () {
        this.lc = null;
        L.prototype.h.call(this)
    };
    v(jk.prototype, {I: K});

    function kk(a) {
        L.call(this, Hj, void 0, a, "blank")
    }

    p(kk, L);

    function lk(a) {
        L.call(this, Fj, void 0, a, "callback")
    }

    p(lk, L);
    lk.prototype.aa = function (a, b, c, d) {
        return a.apply(null, b).then(c, d)
    };

    function mk(a, b) {
        L.call(this, Lj, void 0, b, "differentDeviceError");
        this.lc = a
    }

    p(mk, L);
    mk.prototype.j = function () {
        var a = this;
        I(this, this.I(), function () {
            a.lc()
        });
        this.I().focus();
        L.prototype.j.call(this)
    };
    mk.prototype.h = function () {
        this.lc = null;
        L.prototype.h.call(this)
    };
    v(mk.prototype, {I: K});

    function nk(a, b, c, d) {
        L.call(this, Vj, {email: a, l: !!c}, d, "emailChangeRevoke");
        this.oc = b;
        this.ca = c || null
    }

    p(nk, L);
    nk.prototype.j = function () {
        var a = this;
        I(this, ok(this), function () {
            a.oc()
        });
        this.ca && (this.u(this.ca), this.C().focus());
        L.prototype.j.call(this)
    };
    nk.prototype.h = function () {
        this.oc = this.ca = null;
        L.prototype.h.call(this)
    };

    function ok(a) {
        return a.s("firebaseui-id-reset-password-link")
    }

    v(nk.prototype, {C: J, I: K, u: si});

    function pk(a, b, c, d, e, f) {
        L.call(this, Kj, {email: c}, f, "emailLinkSignInConfirmation", {O: d, N: e});
        this.Ca = a;
        this.D = b
    }

    p(pk, L);
    pk.prototype.j = function () {
        this.Aa(this.Ca);
        this.u(this.Ca, this.D);
        this.Da();
        L.prototype.j.call(this)
    };
    pk.prototype.h = function () {
        this.D = this.Ca = null;
        L.prototype.h.call(this)
    };
    pk.prototype.Da = function () {
        this.w().focus();
        le(this.w(), (this.w().value || "").length)
    };
    v(pk.prototype, {w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, C: J, I: K, u: si});

    function qk(a, b, c, d, e, f) {
        L.call(this, Oj, {email: a, G: b}, f, "emailLinkSignInLinking", {O: d, N: e});
        this.m = c
    }

    p(qk, L);
    qk.prototype.j = function () {
        this.u(this.m);
        this.C().focus();
        L.prototype.j.call(this)
    };
    qk.prototype.h = function () {
        this.m = null;
        L.prototype.h.call(this)
    };
    v(qk.prototype, {C: J, u: si});

    function rk(a, b, c, d, e) {
        L.call(this, Pj, {G: a}, e, "emailLinkSignInLinkingDifferentDevice", {O: c, N: d});
        this.ca = b
    }

    p(rk, L);
    rk.prototype.j = function () {
        this.u(this.ca);
        this.C().focus();
        L.prototype.j.call(this)
    };
    rk.prototype.h = function () {
        this.ca = null;
        L.prototype.h.call(this)
    };
    v(rk.prototype, {C: J, u: si});

    function sk(a, b, c, d, e, f) {
        L.call(this, Ij, {email: a}, f, "emailLinkSignInSent", {O: d, N: e});
        this.jf = b;
        this.D = c
    }

    p(sk, L);
    sk.prototype.j = function () {
        var a = this;
        I(this, this.I(), function () {
            a.D()
        });
        I(this, this.s("firebaseui-id-trouble-getting-email-link"), function () {
            a.jf()
        });
        this.I().focus();
        L.prototype.j.call(this)
    };
    sk.prototype.h = function () {
        this.D = this.jf = null;
        L.prototype.h.call(this)
    };
    v(sk.prototype, {I: K});

    function tk(a, b, c, d, e, f, g) {
        L.call(this, ck, {Kf: a, lf: b}, g, "emailMismatch", {O: e, N: f});
        this.ca = c;
        this.D = d
    }

    p(tk, L);
    tk.prototype.j = function () {
        this.u(this.ca, this.D);
        this.C().focus();
        L.prototype.j.call(this)
    };
    tk.prototype.h = function () {
        this.D = this.m = null;
        L.prototype.h.call(this)
    };
    v(tk.prototype, {C: J, I: K, u: si});

    function uk(a, b, c, d, e) {
        L.call(this, Jj, void 0, e, "emailNotReceived", {O: c, N: d});
        this.nc = a;
        this.D = b
    }

    p(uk, L);
    uk.prototype.j = function () {
        var a = this;
        I(this, this.I(), function () {
            a.D()
        });
        I(this, this.Lc(), function () {
            a.nc()
        });
        this.I().focus();
        L.prototype.j.call(this)
    };
    uk.prototype.Lc = function () {
        return this.s("firebaseui-id-resend-email-link")
    };
    uk.prototype.h = function () {
        this.D = this.nc = null;
        L.prototype.h.call(this)
    };
    v(uk.prototype, {I: K});

    function vk(a, b, c, d, e, f) {
        L.call(this, Qj, {email: a, G: b}, f, "federatedLinking", {O: d, N: e});
        this.m = c
    }

    p(vk, L);
    vk.prototype.j = function () {
        this.u(this.m);
        this.C().focus();
        L.prototype.j.call(this)
    };
    vk.prototype.h = function () {
        this.m = null;
        L.prototype.h.call(this)
    };
    v(vk.prototype, {C: J, u: si});

    function N(a, b, c, d, e, f) {
        L.call(this, a, b, d, e || "notice", f);
        this.ca = c || null
    }

    x(N, L);
    N.prototype.j = function () {
        this.ca && (this.u(this.ca), this.C().focus());
        N.Z.j.call(this)
    };
    N.prototype.h = function () {
        this.ca = null;
        N.Z.h.call(this)
    };
    v(N.prototype, {C: J, I: K, u: si});

    function wk(a, b, c, d, e) {
        N.call(this, Ej, {email: a, l: !!b}, b, e, "passwordRecoveryEmailSent", {O: c, N: d})
    }

    x(wk, N);

    function xk(a, b) {
        N.call(this, Xj, {l: !!a}, a, b, "emailVerificationSuccess")
    }

    x(xk, N);

    function yk(a, b) {
        N.call(this, Yj, {l: !!a}, a, b, "emailVerificationFailure")
    }

    x(yk, N);

    function zk(a) {
        N.call(this, gk, void 0, void 0, a, "signOut")
    }

    x(zk, N);

    function Ak(a, b) {
        N.call(this, Tj, {l: !!a}, a, b, "passwordResetSuccess")
    }

    x(Ak, N);

    function Bk(a, b) {
        N.call(this, Uj, {l: !!a}, a, b, "passwordResetFailure")
    }

    x(Bk, N);

    function Ck(a, b) {
        N.call(this, Wj, {l: !!a}, a, b, "emailChangeRevokeFailure")
    }

    x(Ck, N);

    function Dk(a, b, c) {
        N.call(this, ak, {errorMessage: a, Sb: !!b}, b, c, "recoverableError")
    }

    x(Dk, N);

    function Ek(a, b) {
        N.call(this, bk, {errorMessage: a}, void 0, b, "unrecoverableError")
    }

    x(Ek, N);

    function Fk(a, b, c, d, e, f) {
        L.call(this, Nj, {email: a}, f, "passwordLinking", {O: d, N: e});
        this.m = b;
        this.ad = c
    }

    p(Fk, L);
    Fk.prototype.j = function () {
        this.Rd();
        this.u(this.m, this.ad);
        zj(this, this.Ka(), this.m);
        this.Ka().focus();
        L.prototype.j.call(this)
    };
    Fk.prototype.h = function () {
        this.m = null;
        L.prototype.h.call(this)
    };
    Fk.prototype.oa = function () {
        return je(this.s("firebaseui-id-email"))
    };
    v(Fk.prototype, {Ka: Xi, Jd: Yi, Rd: Zi, Ad: $i, C: J, I: K, u: si});

    function Gk(a, b, c, d, e, f) {
        L.call(this, Dj, {email: c, ta: !!b}, f, "passwordRecovery", {O: d, N: e});
        this.m = a;
        this.D = b
    }

    p(Gk, L);
    Gk.prototype.j = function () {
        this.Aa();
        this.u(this.m, this.D);
        je(this.w()) || this.w().focus();
        zj(this, this.w(), this.m);
        L.prototype.j.call(this)
    };
    Gk.prototype.h = function () {
        this.D = this.m = null;
        L.prototype.h.call(this)
    };
    v(Gk.prototype, {w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, C: J, I: K, u: si});

    function Hk(a, b, c) {
        L.call(this, Sj, {email: a}, c, "passwordReset");
        this.m = b
    }

    p(Hk, L);
    Hk.prototype.j = function () {
        this.Qd();
        this.u(this.m);
        zj(this, this.ya(), this.m);
        this.ya().focus();
        L.prototype.j.call(this)
    };
    Hk.prototype.h = function () {
        this.m = null;
        L.prototype.h.call(this)
    };
    v(Hk.prototype, {ya: Ri, Id: Ui, Pg: Si, Qd: Vi, zd: Wi, C: J, I: K, u: si});

    function Ik(a, b, c, d, e, f, g) {
        L.call(this, Bj, {email: c, L: !!f}, g, "passwordSignIn", {O: d, N: e});
        this.m = a;
        this.ad = b
    }

    p(Ik, L);
    Ik.prototype.j = function () {
        this.Aa();
        this.Rd();
        this.u(this.m, this.ad);
        yj(this, this.w(), this.Ka());
        zj(this, this.Ka(), this.m);
        je(this.w()) ? this.Ka().focus() : this.w().focus();
        L.prototype.j.call(this)
    };
    Ik.prototype.h = function () {
        this.ad = this.m = null;
        L.prototype.h.call(this)
    };
    v(Ik.prototype, {w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, Ka: Xi, Jd: Yi, Rd: Zi, Ad: $i, C: J, I: K, u: si});

    function Jk(a, b, c, d, e, f, g, k, l) {
        L.call(this, Cj, {email: d, tc: a, name: e, ta: !!c, L: !!k}, l, "passwordSignUp", {O: f, N: g});
        this.m = b;
        this.D = c;
        this.ae = a
    }

    p(Jk, L);
    Jk.prototype.j = function () {
        this.Aa();
        this.ae && this.Zg();
        this.Qd();
        this.u(this.m, this.D);
        this.Da();
        L.prototype.j.call(this)
    };
    Jk.prototype.h = function () {
        this.D = this.m = null;
        L.prototype.h.call(this)
    };
    Jk.prototype.Da = function () {
        this.ae ? (yj(this, this.w(), this.bc()), yj(this, this.bc(), this.ya())) : yj(this, this.w(), this.ya());
        this.m && zj(this, this.ya(), this.m);
        je(this.w()) ? this.ae && !je(this.bc()) ? this.bc().focus() : this.ya().focus() : this.w().focus()
    };
    v(Jk.prototype, {
        w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, bc: Pi, xi: Qi, Zg: function () {
            var a = Pi.call(this), b = Qi.call(this);
            Vh(this, a, function () {
                ai(b) && (H(a, !0), Zh(b))
            })
        }, vg: function () {
            var a = Pi.call(this);
            var b = Qi.call(this);
            var c = je(a);
            c = !/^[\s\xa0]*$/.test(null == c ? "" : String(c));
            H(a, c);
            c ? (Zh(b), b = !0) : ($h(b, "Enter your account name".toString()), b = !1);
            return b ? ab(je(a)) : null
        }, ya: Ri, Id: Ui, Pg: Si, Qd: Vi, zd: Wi, C: J, I: K, u: si
    });

    function Kk(a, b, c, d, e, f, g, k, l) {
        L.call(this, fk, {phoneNumber: e}, l, "phoneSignInFinish", {O: g, N: k});
        this.yh = f;
        this.tb = new xf(1E3);
        this.ce = f;
        this.ff = a;
        this.m = b;
        this.D = c;
        this.nc = d
    }

    p(Kk, L);
    Kk.prototype.j = function () {
        var a = this;
        this.Gf(this.yh);
        De(this.tb, "tick", this.Nd, !1, this);
        this.tb.start();
        I(this, this.s("firebaseui-id-change-phone-number-link"), function () {
            a.ff()
        });
        I(this, this.Lc(), function () {
            a.nc()
        });
        this.$g(this.m);
        this.u(this.m, this.D);
        this.Da();
        L.prototype.j.call(this)
    };
    Kk.prototype.h = function () {
        this.nc = this.D = this.m = this.ff = null;
        this.tb.stop();
        Le(this.tb, "tick", this.Nd);
        this.tb = null;
        L.prototype.h.call(this)
    };
    Kk.prototype.Nd = function () {
        --this.ce;
        0 < this.ce ? this.Gf(this.ce) : (this.tb.stop(), Le(this.tb, "tick", this.Nd), this.Vg(), this.Lh())
    };
    Kk.prototype.Da = function () {
        this.Kd().focus()
    };
    v(Kk.prototype, {
        Kd: aj, Qg: bj, $g: function (a) {
            var b = aj.call(this), c = bj.call(this);
            Vh(this, b, function () {
                ai(c) && (H(b, !0), Zh(c))
            });
            a && Wh(this, b, function () {
                a()
            })
        }, wg: function () {
            var a = ab(je(aj.call(this)) || "");
            return /^\d{6}$/.test(a) ? a : null
        }, Tg: oj, Gf: function (a) {
            var b = oj.call(this);
            a = (9 < a ? "0:" : "0:0") + a;
            a = "Resend code in " + G("string" === typeof a, "timeRemaining", a, "string");
            Lc(b, a.toString())
        }, Vg: function () {
            Zh(this.Tg())
        }, Lc: function () {
            return this.s("firebaseui-id-resend-link")
        }, Lh: function () {
            $h(this.Lc())
        },
        C: J, I: K, u: si
    });

    function Lk(a, b, c, d, e, f, g, k, l, n) {
        L.call(this, ek, {Zb: b, Oa: l || null, xa: !!c, L: !!f}, n, "phoneSignInStart", {O: d, N: e});
        this.Ag = k || null;
        this.Gg = b;
        this.m = a;
        this.D = c || null;
        this.ih = g || null
    }

    p(Lk, L);
    Lk.prototype.j = function () {
        this.ah(this.ih, this.Ag);
        this.u(this.m, this.D || void 0);
        this.Da();
        L.prototype.j.call(this)
    };
    Lk.prototype.h = function () {
        this.D = this.m = null;
        L.prototype.h.call(this)
    };
    Lk.prototype.Da = function () {
        this.Gg || yj(this, this.ib(), this.C());
        zj(this, this.C(), this.m);
        this.ib().focus();
        le(this.ib(), (this.ib().value || "").length)
    };
    v(Lk.prototype, {
        Og: hi, ib: fj, Se: hj, ah: function (a, b, c) {
            var d = this, e = fj.call(this), f = gj.call(this), g = hj.call(this), k = a || Uh, l = k.Sa;
            if (0 == l.length) throw Error("No available countries provided.");
            ij.call(d, k, b);
            I(this, f, function () {
                nj.call(d, k)
            });
            Vh(this, e, function () {
                ai(g) && (H(e, !0), Zh(g));
                var n = ab(je(e) || ""), m = Ph(this.rc), u = k.search(n);
                n = jj("1-US-0", l);
                u.length && u[0].a != m.a && (m = u[0], kj.call(d, "1" == m.a && n ? "1-US-0" : m.b, k))
            });
            c && Wh(this, e, function () {
                c()
            })
        }, Rg: function (a) {
            var b = ab(je(fj.call(this)) || "");
            a =
                a || Uh;
            var c = a.Sa, d = Uh.search(b);
            if (d.length && !Ra(c, d[0])) throw ke(fj.call(this)), fj.call(this).focus(), $h(hj.call(this), "The country code provided is not supported.".toString()), Error("The country code provided is not supported.");
            c = Ph(this.rc);
            d.length && d[0].a != c.a && kj.call(this, d[0].b, a);
            d.length && (b = b.substr(d[0].a.length + 1));
            return b ? new cj(this.rc, b) : null
        }, ti: gj, Sg: function () {
            return this.s("firebaseui-recaptcha-container")
        }, Ld: function () {
            return this.s("firebaseui-id-recaptcha-error")
        }, C: J, I: K,
        u: si
    });

    function Mk(a, b, c, d) {
        L.call(this, ik, void 0, d, "providerMatchByEmail", {O: b, N: c});
        this.Ca = a
    }

    p(Mk, L);
    Mk.prototype.j = function () {
        this.Aa(this.Ca);
        this.u(this.Ca);
        this.Da();
        L.prototype.j.call(this)
    };
    Mk.prototype.h = function () {
        this.Ca = null;
        L.prototype.h.call(this)
    };
    Mk.prototype.Da = function () {
        this.w().focus();
        le(this.w(), (this.w().value || "").length)
    };
    v(Mk.prototype, {w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, C: J, u: si});

    function Nk(a, b, c, d, e) {
        L.call(this, dk, {nf: b}, e, "providerSignIn", {O: c, N: d});
        this.gf = a
    }

    p(Nk, L);
    Nk.prototype.j = function () {
        this.Yg(this.gf);
        L.prototype.j.call(this)
    };
    Nk.prototype.h = function () {
        this.gf = null;
        L.prototype.h.call(this)
    };
    v(Nk.prototype, {
        Yg: function (a) {
            function b(g) {
                a(g)
            }

            for (var c = this.Kc("firebaseui-id-idp-button"), d = 0; d < c.length; d++) {
                var e = c[d], f = $d(e, "providerId");
                I(this, e, Ea(b, f))
            }
        }
    });

    function Ok(a, b, c, d, e) {
        L.call(this, Zj, {factorId: a, phoneNumber: c || null, l: !!d}, e, "revertSecondFactorAdditionSuccess");
        this.oc = b;
        this.ca = d || null
    }

    p(Ok, L);
    Ok.prototype.j = function () {
        var a = this;
        I(this, ok(this), function () {
            a.oc()
        });
        this.ca && (this.u(this.ca), this.C().focus());
        L.prototype.j.call(this)
    };
    Ok.prototype.h = function () {
        this.oc = this.ca = null;
        L.prototype.h.call(this)
    };
    v(Ok.prototype, {C: J, I: K, u: si});

    function Pk(a, b, c, d, e) {
        L.call(this, hk, {Bf: b}, e, "selectTenant", {O: c, N: d});
        this.hf = a
    }

    p(Pk, L);
    Pk.prototype.j = function () {
        Qk(this, this.hf);
        L.prototype.j.call(this)
    };
    Pk.prototype.h = function () {
        this.hf = null;
        L.prototype.h.call(this)
    };

    function Qk(a, b) {
        function c(k) {
            b(k)
        }

        for (var d = a.Kc("firebaseui-id-tenant-selection-button"), e = 0; e < d.length; e++) {
            var f = d[e], g = $d(f, "tenantId");
            I(a, f, Ea(c, g))
        }
    };

    function Rk(a, b, c, d, e, f, g) {
        L.call(this, Aj, {email: c, xa: !!b, L: !!f}, g, "signIn", {O: d, N: e});
        this.Ca = a;
        this.D = b
    }

    p(Rk, L);
    Rk.prototype.j = function () {
        this.Aa(this.Ca);
        this.u(this.Ca, this.D || void 0);
        this.Da();
        L.prototype.j.call(this)
    };
    Rk.prototype.h = function () {
        this.D = this.Ca = null;
        L.prototype.h.call(this)
    };
    Rk.prototype.Da = function () {
        this.w().focus();
        le(this.w(), (this.w().value || "").length)
    };
    v(Rk.prototype, {w: ni, $a: oi, Aa: pi, getEmail: qi, oa: ri, C: J, I: K, u: si});

    function Sk(a) {
        L.call(this, Gj, void 0, a, "spinner")
    }

    p(Sk, L);

    function Tk(a, b, c, d, e, f) {
        L.call(this, Rj, {email: a}, f, "unsupportedProvider", {O: d, N: e});
        this.m = b;
        this.D = c
    }

    p(Tk, L);
    Tk.prototype.j = function () {
        this.u(this.m, this.D);
        this.C().focus();
        L.prototype.j.call(this)
    };
    Tk.prototype.h = function () {
        this.D = this.m = null;
        L.prototype.h.call(this)
    };
    v(Tk.prototype, {C: J, I: K, u: si});

    function Uk(a, b, c, d) {
        this.Yb = a;
        this.Le = b || null;
        this.rh = c || null;
        this.pf = d || null
    }

    Uk.prototype.getEmail = function () {
        return this.Yb
    };
    Uk.prototype.cc = function () {
        return this.pf || null
    };
    Uk.prototype.Ta = function () {
        return {email: this.Yb, displayName: this.Le, photoUrl: this.rh, providerId: this.pf}
    };

    function Vk(a) {
        return a.email ? new Uk(a.email, a.displayName, a.photoUrl, a.providerId) : null
    };var Wk = null;

    function Xk(a) {
        return !(!a || -32E3 != a.code || "Service unavailable" != a.message)
    }

    function Yk(a, b, c, d) {
        Wk || (a = {
            callbacks: {
                empty: a, select: function (e, f) {
                    e && e.account && b ? b(Vk(e.account)) : c && c(!Xk(f))
                }, store: a, update: a
            }, language: "en", providers: void 0, ui: d
        }, "undefined" != typeof accountchooser && accountchooser.Api && accountchooser.Api.init ? Wk = accountchooser.Api.init(a) : (Wk = new Zk(a), $k()))
    }

    function al(a, b, c) {
        function d() {
            var e = Hg(window.location.href, c).toString();
            Wk.select(Oa(b || [], function (f) {
                return f.Ta()
            }), {clientCallbackUrl: e})
        }

        b && b.length ? d() : Wk.checkEmpty(function (e, f) {
            e || f ? a(!Xk(f)) : d()
        })
    }

    function Zk(a) {
        this.g = a;
        this.g.callbacks = this.g.callbacks || {}
    }

    function $k() {
        var a = Wk;
        Ba(a.g.callbacks.empty) && a.g.callbacks.empty()
    }

    h = Zk.prototype;
    h.store = function () {
        Ba(this.g.callbacks.store) && this.g.callbacks.store(void 0, bl)
    };
    h.select = function () {
        Ba(this.g.callbacks.select) && this.g.callbacks.select(void 0, bl)
    };
    h.update = function () {
        Ba(this.g.callbacks.update) && this.g.callbacks.update(void 0, bl)
    };
    h.checkDisabled = function (a) {
        a(!0)
    };
    h.checkEmpty = function (a) {
        a(void 0, bl)
    };
    h.checkAccountExist = function (a, b) {
        b(void 0, bl)
    };
    h.checkShouldUpdate = function (a, b) {
        b(void 0, bl)
    };
    var bl = {code: -32E3, message: "Service unavailable", data: "Service is unavailable."};

    function cl(a) {
        this.W = Gg(a)
    }

    function dl(a, b) {
        b ? Fg(a.W, O.td, b) : a.W.removeParameter(O.td)
    }

    cl.prototype.ge = function (a) {
        a ? Fg(this.W, O.ud, a) : this.W.removeParameter(O.ud)
    };
    cl.prototype.kb = function () {
        return this.W.V.get(O.ud) || null
    };

    function el(a, b) {
        null !== b ? Fg(a.W, O.rd, b ? "1" : "0") : a.W.removeParameter(O.rd)
    }

    function fl(a) {
        return a.W.V.get(O.qd) || null
    }

    function gl(a, b) {
        b ? Fg(a.W, O.PROVIDER_ID, b) : a.W.removeParameter(O.PROVIDER_ID)
    }

    cl.prototype.cc = function () {
        return this.W.V.get(O.PROVIDER_ID) || null
    };
    cl.prototype.toString = function () {
        return this.W.toString()
    };
    var O = {
        qd: "ui_auid",
        fi: "apiKey",
        rd: "ui_sd",
        Yf: "mode",
        se: "oobCode",
        PROVIDER_ID: "ui_pid",
        td: "ui_sid",
        ud: "tenantId"
    };

    function hl() {
        this.Ma = {}
    }

    hl.prototype.define = function (a, b) {
        if (a.toLowerCase() in this.Ma) throw Error("Configuration " + a + " has already been defined.");
        this.Ma[a.toLowerCase()] = b
    };
    hl.prototype.update = function (a, b) {
        if (!(a.toLowerCase() in this.Ma)) throw Error("Configuration " + a + " is not defined.");
        this.Ma[a.toLowerCase()] = b
    };
    hl.prototype.get = function (a) {
        if (!(a.toLowerCase() in this.Ma)) throw Error("Configuration " + a + " is not defined.");
        return this.Ma[a.toLowerCase()]
    };

    function il(a, b) {
        a = a.get(b);
        if (!a) throw Error("Configuration " + b + " is required.");
        return a
    };

    function jl(a, b, c, d) {
        this.jh = "undefined" !== typeof a && null !== a ? a : -1;
        this.la = b || null;
        this.pa = c || null;
        this.Ch = !!d
    }

    p(jl, Wg);
    jl.prototype.set = function (a, b) {
        Uf.set(a, b, this.jh, this.la, this.pa, this.Ch)
    };
    jl.prototype.get = function (a) {
        return Uf.get(a) || null
    };
    jl.prototype.remove = function (a) {
        Uf.remove(a, this.la, this.pa)
    };

    function kl(a, b) {
        a = new $c(ll(a));
        b = rd(b);
        for (var c = Ya(b, 0, 16), d = "", e; c.length;) {
            e = 16 - c.length;
            for (var f = 0; f < e; f++) c.push(0);
            d += sd(a.encrypt(c));
            c = Ya(b, 0, 16)
        }
        return d
    }

    function ml(a, b) {
        a = new $c(ll(a));
        for (var c = [], d = 0; d < b.length; d += 2) c.push(parseInt(b.substring(d, d + 2), 16));
        d = Ya(c, 0, 16);
        for (b = ""; d.length;) {
            d = a.decrypt(d);
            if (8192 >= d.length) d = String.fromCharCode.apply(null, d); else {
                for (var e = "", f = 0; f < d.length; f += 8192) e += String.fromCharCode.apply(null, Za(d, f, f + 8192));
                d = e
            }
            b += d;
            d = Ya(c, 0, 16)
        }
        return b.replace(/(\x00)+$/, "")
    }

    function ll(a) {
        a = rd(a.substring(0, 32));
        for (var b = 32 - a.length, c = 0; c < b; c++) a.push(0);
        return a
    };

    function nl() {
        try {
            return !(!window.opener || !window.opener.location || window.opener.location.hostname !== window.location.hostname || window.opener.location.protocol !== window.location.protocol)
        } catch (a) {
        }
        return !1
    }

    function ol(a) {
        ie(a, {target: window.cordova && window.cordova.InAppBrowser ? "_system" : "_blank"}, void 0)
    }

    function pl(a, b) {
        a = r(a) && 1 == a.nodeType ? a : document.querySelector(String(a));
        if (null == a) throw Error(b || "Cannot find element.");
        return a
    }

    function ql() {
        return window.location.href
    }

    function rl() {
        var a = null;
        return (new B(function (b) {
            "complete" == q.document.readyState ? b() : (a = function () {
                b()
            }, Ee(window, "load", a))
        })).Nb(function (b) {
            Le(window, "load", a);
            throw b;
        })
    }

    function sl() {
        for (var a = 32, b = []; 0 < a;) b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62 * Math.random()))), a--;
        return b.join("")
    }

    function tl(a, b, c) {
        c = void 0 === c ? {} : c;
        return Object.keys(a).filter(function (d) {
            return b.includes(d)
        }).reduce(function (d, e) {
            d[e] = a[e];
            return d
        }, c)
    };

    function ul(a) {
        this.Cb = a || q.googleyolo;
        this.Yc = null;
        this.Xe = !1
    }

    ul.prototype.cancel = function () {
        this.Cb && this.Xe && (this.Yc = this.Cb.cancelLastOperation()["catch"](function () {
        }))
    };
    ul.prototype.show = function (a, b) {
        var c = this;
        if (this.Cb && a) {
            var d = function () {
                c.Xe = !0;
                var e = Promise.resolve(null);
                b || (e = c.Cb.retrieve(a)["catch"](function (f) {
                    if ("userCanceled" === f.type || "illegalConcurrentRequest" === f.type) throw f;
                    return null
                }));
                return e.then(function (f) {
                    return f ? f : c.Cb.hint(a)
                })["catch"](function (f) {
                    if ("userCanceled" === f.type) c.Yc = Promise.resolve(); else if ("illegalConcurrentRequest" === f.type) return c.cancel(), c.show(a, b);
                    return null
                })
            };
            return this.Yc ? this.Yc.then(d) : d()
        }
        if (a) return d =
            vl.Hd().load().then(function () {
                c.Cb = q.googleyolo;
                return c.show(a, b)
            }).Nb(function () {
                return null
            }), Promise.resolve(d);
        if ("undefined" !== typeof Promise) return Promise.resolve(null);
        throw Error("One-Tap sign in not supported in the current browser!");
    };
    xa(ul);
    var wl = new wb(xb, "https://smartlock.google.com/client");

    function vl() {
        this.Eb = null
    }

    vl.prototype.load = function () {
        var a = this;
        if (this.Eb) return this.Eb;
        var b = new Cb(Db, zb(wl));
        return q.googleyolo ? C() : this.Eb = rl().then(function () {
            if (!q.googleyolo) return new B(function (c, d) {
                var e = setTimeout(function () {
                    a.Eb = null;
                    d(Error("Network error!"))
                }, 1E4);
                q.onGoogleYoloLoad = function () {
                    clearTimeout(e);
                    c()
                };
                C(fg(b)).Nb(function (f) {
                    clearTimeout(e);
                    a.Eb = null;
                    d(f)
                })
            })
        })
    };
    xa(vl);

    function xl(a, b) {
        for (var c = 0; c < a.length; c++) if (!Ra(yl, a[c]) && (null !== zl && a[c] in zl || Ra(b, a[c]))) return a[c];
        return null
    }

    var yl = ["emailLink", "password", "phone"], zl = {
        "facebook.com": "FacebookAuthProvider",
        "github.com": "GithubAuthProvider",
        "google.com": "GoogleAuthProvider",
        password: "EmailAuthProvider",
        "twitter.com": "TwitterAuthProvider",
        phone: "PhoneAuthProvider"
    };
    var Qf;
    Qf = Gd("firebaseui");
    var Al = new Od;
    if (1 != Al.Ye) {
        var Bl;
        Fd();
        Bl = Ed;
        var Cl = Al.th;
        Bl.ec || (Bl.ec = []);
        Bl.ec.push(Cl);
        Al.Ye = !0
    }

    function Dl(a) {
        var b = Qf;
        b && b.log(zd, a, void 0)
    };

    function El(a, b) {
        this.Yb = a;
        this.va = b || null
    }

    El.prototype.getEmail = function () {
        return this.Yb
    };
    El.prototype.Ta = function () {
        return {email: this.Yb, credential: this.va && this.va.toJSON()}
    };

    function Fl(a) {
        if (a && a.email) {
            var b = a.credential && firebase.auth.AuthCredential.fromJSON(a.credential);
            return new El(a.email, b)
        }
        return null
    };

    function Gl(a, b) {
        this.zg = a;
        this.Hg = b || function (c) {
            throw c;
        };
        this.verificationId = a.verificationId
    }

    Gl.prototype.confirm = function (a) {
        return C(this.zg.confirm(a)).Nb(this.Hg)
    };

    function Hl(a) {
        this.Cf = a || null
    }

    Hl.prototype.kb = function () {
        return this.Cf
    };
    Hl.prototype.Ta = function () {
        return {tenantId: this.Cf}
    };
    var Il = /MSIE ([\d.]+).*Windows NT ([\d.]+)/, Jl = /Firefox\/([\d.]+)/,
        Kl = /Opera[ \/]([\d.]+)(.*Version\/([\d.]+))?/, Ll = /Chrome\/([\d.]+)/,
        Ml = /((Windows NT ([\d.]+))|(Mac OS X ([\d_]+))).*Version\/([\d.]+).*Safari/,
        Nl = /Mac OS X;.*(?!(Version)).*Safari/, Ol = /Android ([\d.]+).*Safari/,
        Pl = /OS ([\d_]+) like Mac OS X.*Mobile.*Safari/, Ql = /Konqueror\/([\d.]+)/,
        Rl = /MSIE ([\d.]+).*Windows Phone OS ([\d.]+)/;

    function Sl(a, b) {
        this.Qb = a;
        a = a.split(b || ".");
        this.Ub = [];
        for (b = 0; b < a.length; b++) this.Ub.push(parseInt(a[b], 10))
    }

    Sl.prototype.compare = function (a) {
        a instanceof Sl || (a = new Sl(String(a)));
        for (var b = Math.max(this.Ub.length, a.Ub.length), c = 0; c < b; c++) {
            var d = this.Ub[c], e = a.Ub[c];
            if (void 0 !== d && void 0 !== e && d !== e) return d - e;
            if (void 0 === d) return -1;
            if (void 0 === e) return 1
        }
        return 0
    };

    function Tl(a, b) {
        return 0 <= a.compare(b)
    }

    function Ul() {
        var a = window.navigator && window.navigator.userAgent;
        if (a) {
            var b;
            if (b = a.match(Kl)) {
                var c = new Sl(b[3] || b[1]);
                return 0 <= a.indexOf("Opera Mini") ? !1 : 0 <= a.indexOf("Opera Mobi") ? 0 <= a.indexOf("Android") && Tl(c, "10.1") : Tl(c, "8.0")
            }
            if (b = a.match(Jl)) return Tl(new Sl(b[1]), "2.0");
            if (b = a.match(Ll)) return Tl(new Sl(b[1]), "6.0");
            if (b = a.match(Ml)) return c = new Sl(b[6]), a = b[3] && new Sl(b[3]), b = b[5] && new Sl(b[5], "_"), (!(!a || !Tl(a, "6.0")) || !(!b || !Tl(b, "10.5.6"))) && Tl(c, "3.0");
            if (b = a.match(Ol)) return Tl(new Sl(b[1]),
                "3.0");
            if (b = a.match(Pl)) return Tl(new Sl(b[1], "_"), "4.0");
            if (b = a.match(Ql)) return Tl(new Sl(b[1]), "4.7");
            if (b = a.match(Rl)) return c = new Sl(b[1]), a = new Sl(b[2]), Tl(c, "7.0") && Tl(a, "7.0");
            if (b = a.match(Il)) return c = new Sl(b[1]), a = new Sl(b[2]), Tl(c, "7.0") && Tl(a, "6.0");
            if (a.match(Nl)) return !1
        }
        return !0
    };var Vl, Wl = new $g;
    Vl = Zg(Wl) ? new bh(Wl, "firebaseui") : null;
    var Xl = new ch(Vl), Yl, Zl = new ah;
    Yl = Zg(Zl) ? new bh(Zl, "firebaseui") : null;
    var $l = new ch(Yl), am = {name: "pendingEmailCredential", storage: $l}, bm = {name: "redirectStatus", storage: $l},
        cm = {name: "redirectUrl", storage: $l}, dm = {name: "rememberAccount", storage: $l},
        em = {name: "rememberedAccounts", storage: Xl},
        fm = {name: "emailForSignIn", storage: new ch(new jl(3600, "/"))},
        gm = {name: "pendingEncryptedCredential", storage: new ch(new jl(3600, "/"))};

    function hm(a, b) {
        return a.storage.get(b ? a.name + ":" + b : a.name)
    }

    function im(a, b) {
        a.storage.remove(b ? a.name + ":" + b : a.name)
    }

    function jm(a, b, c) {
        a.storage.set(c ? a.name + ":" + c : a.name, b)
    }

    function km(a) {
        return hm(cm, a) || null
    }

    function lm(a, b) {
        jm(cm, a, b)
    }

    function mm(a, b) {
        jm(dm, a, b)
    }

    function nm(a) {
        a = hm(em, a) || [];
        a = Oa(a, function (b) {
            return Vk(b)
        });
        return Na(a, function (b) {
            return null != b
        })
    }

    function om(a, b) {
        var c = nm(b), d = Qa(c, function (e) {
            return e.getEmail() == a.getEmail() && e.cc() == a.cc()
        });
        -1 < d && Ta(c, d);
        c.unshift(a);
        jm(em, Oa(c, function (e) {
            return e.Ta()
        }), b)
    }

    function pm(a) {
        a = hm(am, a) || null;
        return Fl(a)
    }

    function qm(a) {
        im(am, a)
    }

    function rm(a, b) {
        jm(am, a.Ta(), b)
    }

    function sm(a) {
        return (a = hm(bm, a) || null) && "undefined" !== typeof a.tenantId ? new Hl(a.tenantId) : null
    }

    function tm(a, b) {
        jm(bm, a.Ta(), b)
    }

    function um(a, b) {
        b = hm(fm, b);
        var c = null;
        if (b) try {
            var d = ml(a, b), e = JSON.parse(d);
            c = e && e.email || null
        } catch (f) {
        }
        return c
    }

    function vm(a, b) {
        b = hm(gm, b);
        var c = null;
        if (b) try {
            var d = ml(a, b);
            c = JSON.parse(d)
        } catch (e) {
        }
        return Fl(c || null)
    }

    function wm(a, b, c) {
        jm(gm, kl(a, JSON.stringify(b.Ta())), c)
    };

    function xm(a, b, c) {
        var d = Error.call(this);
        this.message = d.message;
        "stack" in d && (this.stack = d.stack);
        this.code = "firebaseui/" + a;
        if (!(a = b)) {
            b = this.code;
            a = "";
            b = G("string" === typeof b, "code", b, "string");
            switch (r(b) ? b.toString() : b) {
                case "firebaseui/merge-conflict":
                    a += "The current anonymous user failed to upgrade. The non-anonymous credential is already associated with a different user account.";
                    break;
                default:
                    a += ji()
            }
            a = a.toString()
        }
        this.message = a || "";
        this.credential = c || null
    }

    p(xm, Error);
    xm.prototype.Ta = function () {
        return {code: this.code, message: this.message}
    };
    xm.prototype.toJSON = function () {
        return this.Ta()
    };

    function ym() {
        this.g = new hl;
        this.g.define("acUiConfig");
        this.g.define("autoUpgradeAnonymousUsers");
        this.g.define("callbacks");
        this.g.define("credentialHelper", "accountchooser.com");
        this.g.define("immediateFederatedRedirect", !1);
        this.g.define("popupMode", !1);
        this.g.define("privacyPolicyUrl");
        this.g.define("queryParameterForSignInSuccessUrl", "signInSuccessUrl");
        this.g.define("queryParameterForWidgetMode", "mode");
        this.g.define("signInFlow");
        this.g.define("signInOptions");
        this.g.define("signInSuccessUrl");
        this.g.define("siteName");
        this.g.define("tosUrl");
        this.g.define("widgetUrl")
    }

    function zm(a) {
        return a.g.get("acUiConfig") || null
    }

    function Am(a) {
        var b = a.g.get("widgetUrl") || ql();
        return Bm(a, b)
    }

    function Bm(a, b) {
        a = Cm(a);
        for (var c = b.search(pg), d = 0, e, f = []; 0 <= (e = og(b, d, a, c));) f.push(b.substring(d, e)), d = Math.min(b.indexOf("&", e) + 1 || c, c);
        f.push(b.substr(d));
        b = f.join("").replace(rg, "$1");
        c = "=" + encodeURIComponent("select");
        (a += c) ? (c = b.indexOf("#"), 0 > c && (c = b.length), d = b.indexOf("?"), 0 > d || d > c ? (d = c, e = "") : e = b.substring(d + 1, c), b = [b.substr(0, d), e, b.substr(c)], c = b[1], b[1] = a ? c ? c + "&" + a : a : c, a = b[0] + (b[1] ? "?" + b[1] : "") + b[2]) : a = b;
        return a
    }

    function Dm(a) {
        var b = !!a.g.get("autoUpgradeAnonymousUsers");
        b && !Em(a) && Pf('Missing "signInFailure" callback: "signInFailure" callback needs to be provided when "autoUpgradeAnonymousUsers" is set to true.', void 0);
        return b
    }

    function Fm(a) {
        a = a.g.get("signInOptions") || [];
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            d = r(d) ? d : {provider: d};
            d.provider && b.push(d)
        }
        return b
    }

    function Gm(a, b) {
        a = Fm(a);
        for (var c = 0; c < a.length; c++) if (a[c].provider === b) return a[c];
        return null
    }

    function Hm(a) {
        return Oa(Fm(a), function (b) {
            return b.provider
        })
    }

    function Im(a, b) {
        a = Jm(a);
        for (var c = 0; c < a.length; c++) if (a[c].providerId === b) return a[c];
        return null
    }

    function Jm(a) {
        return Oa(Fm(a), function (b) {
            return zl[b.provider] || Ra(Km, b.provider) ? {providerId: b.provider} : {
                providerId: b.provider,
                qf: b.providerName || null,
                Ac: b.buttonColor || null,
                Tc: b.iconUrl ? Jb(Lb(b.iconUrl)) : null,
                hh: b.loginHintKey || null
            }
        })
    }

    function Lm(a) {
        var b = [], c = [];
        La(Fm(a), function (e) {
            e.authMethod && (b.push(e.authMethod), e.clientId && c.push({uri: e.authMethod, clientId: e.clientId}))
        });
        var d = null;
        "googleyolo" === Mm(a) && b.length && (d = {supportedIdTokenProviders: c, supportedAuthMethods: b});
        return d
    }

    function Nm(a, b) {
        var c = null;
        La(Fm(a), function (d) {
            d.authMethod === b && (c = d.provider)
        });
        return c
    }

    function Om(a) {
        var b = null;
        La(Fm(a), function (d) {
            d.provider == firebase.auth.PhoneAuthProvider.PROVIDER_ID && r(d.recaptchaParameters) && !za(d.recaptchaParameters) && (b = pb(d.recaptchaParameters))
        });
        if (b) {
            var c = [];
            La(Pm, function (d) {
                "undefined" !== typeof b[d] && (c.push(d), delete b[d])
            });
            c.length && Dl('The following provided "recaptchaParameters" keys are not allowed: ' + c.join(", "))
        }
        return b
    }

    function Qm(a, b) {
        a = (a = Gm(a, b)) && a.scopes;
        return za(a) ? a : []
    }

    function Rm(a, b) {
        a = (a = Gm(a, b)) && a.customParameters;
        return r(a) ? (a = pb(a), b === firebase.auth.GoogleAuthProvider.PROVIDER_ID && delete a.login_hint, b === firebase.auth.GithubAuthProvider.PROVIDER_ID && delete a.login, a) : null
    }

    function Sm(a) {
        a = Gm(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID);
        var b = null;
        a && "string" === typeof a.loginHint && (b = dj(a.loginHint));
        return a && a.defaultNationalNumber || b && b.Oa || null
    }

    function Tm(a) {
        var b = (a = Gm(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)) && a.defaultCountry || null;
        b = b && Rh(b);
        var c = null;
        a && "string" === typeof a.loginHint && (c = dj(a.loginHint));
        return b && b[0] || c && Ph(c.Fc) || null
    }

    function Um(a) {
        a = Gm(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID);
        if (!a) return null;
        var b = a.whitelistedCountries, c = a.blacklistedCountries;
        if ("undefined" !== typeof b && (!za(b) || 0 == b.length)) throw Error("WhitelistedCountries must be a non-empty array.");
        if ("undefined" !== typeof c && !za(c)) throw Error("BlacklistedCountries must be an array.");
        if (b && c) throw Error("Both whitelistedCountries and blacklistedCountries are provided.");
        if (!b && !c) return Qh;
        a = [];
        if (b) {
            c = {};
            for (var d = 0; d < b.length; d++) {
                var e = Sh(b[d]);
                for (var f = 0; f < e.length; f++) c[e[f].b] = e[f]
            }
            for (var g in c) c.hasOwnProperty(g) && a.push(c[g])
        } else {
            g = {};
            for (b = 0; b < c.length; b++) for (e = Sh(c[b]), d = 0; d < e.length; d++) g[e[d].b] = e[d];
            for (e = 0; e < Qh.length; e++) null !== g && Qh[e].b in g || a.push(Qh[e])
        }
        return a
    }

    function Cm(a) {
        return il(a.g, "queryParameterForWidgetMode")
    }

    ym.prototype.T = function () {
        var a = this.g.get("tosUrl") || null, b = this.g.get("privacyPolicyUrl") || null;
        a && !b && Dl("Privacy Policy URL is missing, the link will not be displayed.");
        if (a && b) {
            if (Ba(a)) return a;
            if ("string" === typeof a) return function () {
                ol(a)
            }
        }
        return null
    };
    ym.prototype.S = function () {
        var a = this.g.get("tosUrl") || null, b = this.g.get("privacyPolicyUrl") || null;
        b && !a && Dl("Term of Service URL is missing, the link will not be displayed.");
        if (a && b) {
            if (Ba(b)) return b;
            if ("string" === typeof b) return function () {
                ol(b)
            }
        }
        return null
    };

    function Vm(a) {
        return (a = Gm(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && "undefined" !== typeof a.requireDisplayName ? !!a.requireDisplayName : !0
    }

    function Wm(a) {
        a = Gm(a, firebase.auth.EmailAuthProvider.PROVIDER_ID);
        return !(!a || a.signInMethod !== firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)
    }

    function Xm(a) {
        a = Gm(a, firebase.auth.EmailAuthProvider.PROVIDER_ID);
        return !(!a || !a.forceSameDevice)
    }

    function Ym(a) {
        if (Wm(a)) {
            var b = {url: ql(), handleCodeInApp: !0};
            (a = Gm(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && "function" === typeof a.emailLinkSignIn && rb(b, a.emailLinkSignIn());
            b.url = Hg(ql(), b.url).toString();
            return b
        }
        return null
    }

    function Zm(a) {
        var b = !!a.g.get("immediateFederatedRedirect"), c = Hm(a);
        a = $m(a);
        return b && 1 == c.length && !Ra(yl, c[0]) && "redirect" == a
    }

    function $m(a) {
        a = a.g.get("signInFlow");
        for (var b in an) if (an[b] == a) return an[b];
        return "redirect"
    }

    function bn(a) {
        return cn(a).uiShown || null
    }

    function dn(a) {
        return cn(a).signInSuccess || null
    }

    function en(a) {
        return cn(a).signInSuccessWithAuthResult || null
    }

    function Em(a) {
        return cn(a).signInFailure || null
    }

    function cn(a) {
        return a.g.get("callbacks") || {}
    }

    function fn(a) {
        return "accountchooser.com" == Mm(a)
    }

    function Mm(a) {
        if ("http:" !== (window.location && window.location.protocol) && "https:" !== (window.location && window.location.protocol)) return "none";
        a = a.g.get("credentialHelper");
        for (var b in gn) if (gn[b] == a) return gn[b];
        return "accountchooser.com"
    }

    ym.prototype.Kb = function (a) {
        for (var b in a) try {
            this.g.update(b, a[b])
        } catch (c) {
            Pf('Invalid config: "' + b + '"', void 0)
        }
        kc && this.g.update("popupMode", !1);
        Um(this)
    };
    ym.prototype.update = function (a, b) {
        this.g.update(a, b);
        Um(this)
    };
    var gn = {ei: "accountchooser.com", hi: "googleyolo", NONE: "none"}, an = {li: "popup", mi: "redirect"}, hn = {
        gi: "callback",
        RECOVER_EMAIL: "recoverEmail",
        ni: "resetPassword",
        oi: "select",
        pi: "signIn",
        VERIFY_EMAIL: "verifyEmail"
    }, Km = ["anonymous"], Pm = ["sitekey", "tabindex", "callback", "expired-callback"];
    var jn, kn, ln, mn, P = {};

    function Q(a, b, c, d) {
        P[a].apply(null, Array.prototype.slice.call(arguments, 1))
    };var nn = !1, on = null;

    function pn(a, b) {
        nn = !!b;
        on || ("undefined" == typeof accountchooser && Ul() ? (b = new Cb(Db, zb(new wb(xb, "//www.gstatic.com/accountchooser/client.js"))), on = C(fg(b)).Nb(function () {
        })) : on = C());
        on.then(a, a)
    }

    function qn(a, b) {
        a = R(a);
        (a = cn(a).accountChooserInvoked || null) ? a(b) : b()
    }

    function rn(a, b, c) {
        a = R(a);
        (a = cn(a).accountChooserResult || null) ? a(b, c) : c()
    }

    function sn(a, b, c, d, e) {
        d ? (Q("callback", a, b), nn && c()) : qn(a, function () {
            var f = new Hl(a.kb());
            tm(f, S(a));
            al(function (g) {
                im(bm, S(a));
                rn(a, g ? "empty" : "unavailable", function () {
                    Q("signIn", a, b);
                    (g || nn) && c()
                })
            }, nm(S(a)), e)
        })
    }

    function tn(a, b, c, d) {
        function e(f) {
            f = T(f);
            U(b, c, void 0, f);
            d()
        }

        rn(b, "accountSelected", function () {
            mm(!1, S(b));
            var f = un(b);
            V(b, b.v().fetchSignInMethodsForEmail(a.getEmail()).then(function (g) {
                vn(b, c, g, a.getEmail(), a.Le || void 0, void 0, f);
                d()
            }, e))
        })
    }

    function wn(a, b, c, d) {
        rn(b, a ? "addAccount" : "unavailable", function () {
            Q("signIn", b, c);
            (a || nn) && d()
        })
    }

    function xn(a, b, c, d) {
        function e() {
            var f = a();
            f && (f = bn(R(f))) && f()
        }

        Yk(function () {
            var f = a();
            f && sn(f, b, e, c, d)
        }, function (f) {
            var g = a();
            g && tn(f, g, b, e)
        }, function (f) {
            var g = a();
            g && wn(f, g, b, e)
        }, a() && zm(R(a())))
    }

    function yn(a, b, c, d) {
        function e(g) {
            if (!g.name || "cancel" != g.name) {
                a:{
                    var k = g.message;
                    try {
                        var l = ((JSON.parse(k).error || {}).message || "").toLowerCase().match(/invalid.+(access|id)_token/);
                        if (l && l.length) {
                            var n = !0;
                            break a
                        }
                    } catch (m) {
                    }
                    n = !1
                }
                if (n) g = M(b), b.i(), U(a, g, void 0, "Your sign-in session has expired. Please try again.".toString()); else {
                    n = g && g.message || "";
                    if (g.code) {
                        if ("auth/email-already-in-use" == g.code || "auth/credential-already-in-use" == g.code) return;
                        n = T(g)
                    }
                    b.H(n)
                }
            }
        }

        zn(a);
        if (d) return An(a, c), C();
        if (!c.credential) throw Error("No credential found!");
        d = a.v().currentUser || c.user;
        if (!d) throw Error("User not logged in.");
        d = new Uk(d.email, d.displayName, d.photoURL, "password" == c.credential.providerId ? null : c.credential.providerId);
        null != hm(dm, S(a)) && !hm(dm, S(a)) || om(d, S(a));
        im(dm, S(a));
        try {
            var f = Bn(a, c)
        } catch (g) {
            return Pf(g.code || g.message, g), b.H(g.code || g.message), C()
        }
        c = f.then(function (g) {
            An(a, g)
        }, e).then(void 0, e);
        V(a, f);
        return C(c)
    }

    function An(a, b) {
        if (!b.user) throw Error("No user found");
        var c = en(R(a));
        dn(R(a)) && c && Dl("Both signInSuccess and signInSuccessWithAuthResult callbacks are provided. Only signInSuccessWithAuthResult callback will be invoked.");
        if (c) {
            c = en(R(a));
            var d = km(S(a)) || void 0;
            im(cm, S(a));
            var e = !1;
            if (nl()) {
                if (!c || c(b, d)) e = !0, ac(window.opener.location, Cn(a, d));
                c || window.close()
            } else if (!c || c(b, d)) e = !0, ac(window.location, Cn(a, d));
            e || a.reset()
        } else {
            c = b.user;
            b = b.credential;
            d = dn(R(a));
            e = km(S(a)) || void 0;
            im(cm, S(a));
            var f = !1;
            if (nl()) {
                if (!d || d(c, b, e)) f = !0, ac(window.opener.location, Cn(a, e));
                d || window.close()
            } else if (!d || d(c, b, e)) f = !0, ac(window.location, Cn(a, e));
            f || a.reset()
        }
    }

    function Cn(a, b) {
        a = b || R(a).g.get("signInSuccessUrl");
        if (!a) throw Error("No redirect URL has been found. You must either specify a signInSuccessUrl in the configuration, pass in a redirect URL to the widget URL, or return false from the callback.");
        return a
    }

    function T(a) {
        var b = a.code, c = "";
        b = G("string" === typeof b, "code", b, "string");
        switch (r(b) ? b.toString() : b) {
            case "auth/email-already-in-use":
                c += "The email address is already used by another account";
                break;
            case "auth/requires-recent-login":
                c += mi();
                break;
            case "auth/too-many-requests":
                c += "You have entered an incorrect password too many times. Please try again in a few minutes.";
                break;
            case "auth/user-cancelled":
                c += "Please authorize the required permissions to sign in to the application";
                break;
            case "auth/user-not-found":
                c +=
                    "That email address doesn't match an existing account";
                break;
            case "auth/user-token-expired":
                c += mi();
                break;
            case "auth/weak-password":
                c += "Strong passwords have at least 6 characters and a mix of letters and numbers";
                break;
            case "auth/wrong-password":
                c += "The email and password you entered don't match";
                break;
            case "auth/network-request-failed":
                c += "A network error has occurred";
                break;
            case "auth/invalid-phone-number":
                c += ii();
                break;
            case "auth/invalid-verification-code":
                c += "Wrong code. Try again.";
                break;
            case "auth/code-expired":
                c +=
                    "This code is no longer valid";
                break;
            case "auth/expired-action-code":
                c += "This code has expired.";
                break;
            case "auth/invalid-action-code":
                c += "The action code is invalid. This can happen if the code is malformed, expired, or has already been used."
        }
        if (c = c.toString()) return c;
        try {
            return JSON.parse(a.message), Pf("Internal error: " + a.message, void 0), ji().toString()
        } catch (d) {
            return a.message
        }
    }

    function Dn(a, b, c) {
        var d = zl[b] && firebase.auth[zl[b]] ? new firebase.auth[zl[b]] : 0 == b.indexOf("saml.") ? new firebase.auth.SAMLAuthProvider(b) : new firebase.auth.OAuthProvider(b);
        if (!d) throw Error("Invalid Firebase Auth provider!");
        var e = Qm(R(a), b);
        if (d.addScope) for (var f = 0; f < e.length; f++) d.addScope(e[f]);
        e = Rm(R(a), b) || {};
        c && (a = b == firebase.auth.GoogleAuthProvider.PROVIDER_ID ? "login_hint" : b == firebase.auth.GithubAuthProvider.PROVIDER_ID ? "login" : (a = Im(R(a), b)) && a.hh, a && (e[a] = c));
        d.setCustomParameters && d.setCustomParameters(e);
        return d
    }

    function En(a, b, c, d) {
        function e() {
            var n = new Hl(a.kb());
            tm(n, S(a));
            V(a, b.aa(t(a.Uh, a), [l], function () {
                if ("file:" === (window.location && window.location.protocol)) return V(a, a.getRedirectResult().then(function (m) {
                    b.i();
                    im(bm, S(a));
                    Q("callback", a, k, C(m))
                }, f))
            }, g))
        }

        function f(n) {
            im(bm, S(a));
            if (!n.name || "cancel" != n.name) switch (n.code) {
                case "auth/popup-blocked":
                    e();
                    break;
                case "auth/popup-closed-by-user":
                case "auth/cancelled-popup-request":
                    break;
                case "auth/credential-already-in-use":
                    break;
                case "auth/network-request-failed":
                case "auth/too-many-requests":
                case "auth/user-cancelled":
                    b.H(T(n));
                    break;
                default:
                    b.i(), Q("callback", a, k, mf(n))
            }
        }

        function g(n) {
            im(bm, S(a));
            n.name && "cancel" == n.name || (Pf("signInWithRedirect: " + n.code, void 0), n = T(n), "blank" == b.Wd && Zm(R(a)) ? (b.i(), Q("providerSignIn", a, k, n)) : b.H(n))
        }

        var k = M(b), l = Dn(a, c, d);
        "redirect" == $m(R(a)) ? e() : V(a, Fn(a, l).then(function (n) {
            b.i();
            Q("callback", a, k, C(n))
        }, f))
    }

    function Gn(a, b) {
        V(a, b.aa(t(a.Qh, a), [], function (c) {
            b.i();
            return yn(a, b, c, !0)
        }, function (c) {
            c.name && "cancel" == c.name || (Pf("ContinueAsGuest: " + c.code, void 0), c = T(c), b.H(c))
        }))
    }

    function Hn(a, b, c) {
        function d(f) {
            var g = !1;
            f = b.aa(t(a.Rh, a), [f], function (k) {
                var l = M(b);
                b.i();
                Q("callback", a, l, C(k));
                g = !0
            }, function (k) {
                if (!k.name || "cancel" != k.name) if (!k || "auth/credential-already-in-use" != k.code) if (k && "auth/email-already-in-use" == k.code && k.email && k.credential) {
                    var l = M(b);
                    b.i();
                    Q("callback", a, l, mf(k))
                } else k = T(k), b.H(k)
            });
            V(a, f);
            return f.then(function () {
                return g
            }, function () {
                return !1
            })
        }

        var e = Nm(R(a), c && c.authMethod || null);
        if (c && c.idToken && e === firebase.auth.GoogleAuthProvider.PROVIDER_ID) return Qm(R(a),
            firebase.auth.GoogleAuthProvider.PROVIDER_ID).length ? (En(a, b, e, c.id), c = C(!0)) : c = d(firebase.auth.GoogleAuthProvider.credential(c.idToken)), c;
        c && b.H("The selected credential for the authentication provider is not supported!".toString());
        return C(!1)
    }

    function In(a, b) {
        var c = b.oa(), d = b.Ad();
        if (c) if (d) {
            var e = firebase.auth.EmailAuthProvider.credential(c, d);
            V(a, b.aa(t(a.Sh, a), [c, d], function (f) {
                return yn(a, b, {
                    user: f.user,
                    credential: e,
                    operationType: f.operationType,
                    additionalUserInfo: f.additionalUserInfo
                })
            }, function (f) {
                if (!f.name || "cancel" != f.name) switch (f.code) {
                    case "auth/email-already-in-use":
                        break;
                    case "auth/email-exists":
                        H(b.w(), !1);
                        $h(b.$a(), T(f));
                        break;
                    case "auth/too-many-requests":
                    case "auth/wrong-password":
                        H(b.Ka(), !1);
                        $h(b.Jd(), T(f));
                        break;
                    default:
                        Pf("verifyPassword: " +
                            f.message, void 0), b.H(T(f))
                }
            }))
        } else b.Ka().focus(); else b.w().focus()
    }

    function un(a) {
        a = Hm(R(a));
        return 1 == a.length && a[0] == firebase.auth.EmailAuthProvider.PROVIDER_ID
    }

    function Jn(a) {
        a = Hm(R(a));
        return 1 == a.length && a[0] == firebase.auth.PhoneAuthProvider.PROVIDER_ID
    }

    function U(a, b, c, d) {
        un(a) ? d ? Q("signIn", a, b, c, d) : Kn(a, b, c) : a && Jn(a) && !d ? Q("phoneSignInStart", a, b) : a && Zm(R(a)) && !d ? Q("federatedRedirect", a, b, c) : Q("providerSignIn", a, b, d, c)
    }

    function Ln(a, b, c, d) {
        var e = M(b);
        V(a, b.aa(t(a.v().fetchSignInMethodsForEmail, a.v()), [c], function (f) {
            mm(fn(R(a)), S(a));
            b.i();
            vn(a, e, f, c, void 0, d)
        }, function (f) {
            f = T(f);
            b.H(f)
        }))
    }

    function vn(a, b, c, d, e, f, g) {
        c.length || Wm(R(a)) ? !c.length && Wm(R(a)) ? Q("sendEmailLinkForSignIn", a, b, d, function () {
            Q("signIn", a, b)
        }) : Ra(c, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) ? Q("passwordSignIn", a, b, d, g) : 1 == c.length && c[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD ? Q("sendEmailLinkForSignIn", a, b, d, function () {
            Q("signIn", a, b)
        }) : (c = xl(c, Hm(R(a)))) ? (rm(new El(d), S(a)), Q("federatedSignIn", a, b, d, c, f)) : Q("unsupportedProvider", a, b, d) : Q("passwordSignUp", a, b, d, e, void 0, g)
    }

    function Mn(a, b, c, d, e, f) {
        var g = M(b);
        V(a, b.aa(t(a.sendSignInLinkToEmail, a), [c, f], function () {
            b.i();
            Q("emailLinkSignInSent", a, g, c, d, f)
        }, e))
    }

    function Kn(a, b, c) {
        fn(R(a)) ? pn(function () {
            Wk ? qn(a, function () {
                var d = new Hl(a.kb());
                tm(d, S(a));
                al(function (e) {
                    im(bm, S(a));
                    rn(a, e ? "empty" : "unavailable", function () {
                        Q("signIn", a, b, c)
                    })
                }, nm(S(a)), Am(R(a)))
            }) : (W(a), xn(Nn, b, !1, Am(R(a))))
        }, !1) : (nn = !1, qn(a, function () {
            rn(a, "unavailable", function () {
                Q("signIn", a, b, c)
            })
        }))
    };

    function On(a) {
        var b = ql();
        a = Cm(R(a));
        b = qg(b, a) || "";
        for (var c in hn) if (hn[c].toLowerCase() == b.toLowerCase()) return hn[c];
        return "callback"
    }

    function Pn(a) {
        var b = ql();
        a = il(R(a).g, "queryParameterForSignInSuccessUrl");
        return (b = qg(b, a)) ? Jb(Lb(b)) : null
    }

    function Qn() {
        return qg(ql(), "oobCode")
    }

    function Rn() {
        var a = qg(ql(), "continueUrl");
        return a ? function () {
            ac(window.location, a)
        } : null
    }

    function Sn(a, b) {
        var c = pl(b, "Could not find the FirebaseUI widget element on the page.");
        b = Pn(a);
        switch (On(a)) {
            case "callback":
                b && lm(b, S(a));
                a.Ze() ? Q("callback", a, c) : U(a, c, Tn(a));
                break;
            case "resetPassword":
                Q("passwordReset", a, c, Qn(), Rn());
                break;
            case "recoverEmail":
                Q("emailChangeRevocation", a, c, Qn());
                break;
            case "verifyEmail":
                Q("emailVerification", a, c, Qn(), Rn());
                break;
            case "signIn":
                Q("emailLinkSignInCallback", a, c, ql());
                Un();
                break;
            case "select":
                if (b && lm(b, S(a)), Wk) {
                    U(a, c);
                    break
                } else {
                    pn(function () {
                        W(a);
                        xn(Nn, c, !0)
                    }, !0);
                    return
                }
            default:
                throw Error("Unhandled widget operation.");
        }
        (b = bn(R(a))) && b()
    };

    function Vn(a, b, c, d, e) {
        var f = c.zd();
        f && V(a, c.aa(t(a.v().confirmPasswordReset, a.v()), [d, f], function () {
            c.i();
            var g = new Ak(e);
            g.render(b);
            X(a, g)
        }, function (g) {
            Wn(a, b, c, g)
        }))
    }

    function Wn(a, b, c, d) {
        "auth/weak-password" == (d && d.code) ? (a = T(d), H(c.ya(), !1), $h(c.Id(), a), c.ya().focus()) : (c && c.i(), c = new Bk, c.render(b), X(a, c))
    }

    function Xn(a, b, c) {
        var d = new nk(c, function () {
            V(a, d.aa(t(a.v().sendPasswordResetEmail, a.v()), [c], function () {
                d.i();
                d = new wk(c, void 0, R(a).T(), R(a).S());
                d.render(b);
                X(a, d)
            }, function () {
                d.H("Unable to send password reset code to specified email".toString())
            }))
        });
        d.render(b);
        X(a, d)
    }

    P.passwordReset = function (a, b, c, d) {
        V(a, a.v().verifyPasswordResetCode(c).then(function (e) {
            var f = new Hk(e, function () {
                Vn(a, b, f, c, d)
            });
            f.render(b);
            X(a, f)
        }, function () {
            Wn(a, b)
        }))
    };
    P.emailChangeRevocation = function (a, b, c) {
        var d = null;
        V(a, a.v().checkActionCode(c).then(function (e) {
            d = e.data.email;
            return a.v().applyActionCode(c)
        }).then(function () {
            Xn(a, b, d)
        }, function () {
            var e = new Ck;
            e.render(b);
            X(a, e)
        }))
    };
    P.emailVerification = function (a, b, c, d) {
        V(a, a.v().applyActionCode(c).then(function () {
            var e = new xk(d);
            e.render(b);
            X(a, e)
        }, function () {
            var e = new yk;
            e.render(b);
            X(a, e)
        }))
    };
    P.anonymousUserMismatch = function (a, b) {
        var c = new jk(function () {
            c.i();
            U(a, b)
        });
        c.render(b);
        X(a, c)
    };

    function Yn(a, b, c) {
        if (c.user) {
            var d = {
                user: c.user,
                credential: c.credential,
                operationType: c.operationType,
                additionalUserInfo: c.additionalUserInfo
            }, e = pm(S(a)), f = e && e.getEmail();
            if (f && !Zn(c.user, f)) $n(a, b, d); else {
                var g = e && e.va;
                g ? V(a, c.user.linkWithCredential(g).then(function (k) {
                    d = {
                        user: k.user,
                        credential: g,
                        operationType: k.operationType,
                        additionalUserInfo: k.additionalUserInfo
                    };
                    ao(a, b, d)
                }, function (k) {
                    bo(a, b, k)
                })) : ao(a, b, d)
            }
        } else c = M(b), b.i(), qm(S(a)), U(a, c)
    }

    function ao(a, b, c) {
        qm(S(a));
        yn(a, b, c)
    }

    function bo(a, b, c) {
        var d = M(b);
        qm(S(a));
        c = T(c);
        b.i();
        U(a, d, void 0, c)
    }

    function co(a, b, c, d) {
        var e = M(b);
        V(a, a.v().fetchSignInMethodsForEmail(c).then(function (f) {
            b.i();
            f.length ? Ra(f, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) ? Q("passwordLinking", a, e, c) : 1 == f.length && f[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD ? Q("emailLinkSignInLinking", a, e, c) : (f = xl(f, Hm(R(a)))) ? Q("federatedLinking", a, e, c, f, d) : (qm(S(a)), Q("unsupportedProvider", a, e, c)) : (qm(S(a)), Q("passwordRecovery", a, e, c, !1, ki().toString()))
        }, function (f) {
            bo(a, b, f)
        }))
    }

    function $n(a, b, c) {
        var d = M(b);
        V(a, eo(a).then(function () {
            b.i();
            Q("emailMismatch", a, d, c)
        }, function (e) {
            e.name && "cancel" == e.name || (e = T(e.code), b.H(e))
        }))
    }

    function Zn(a, b) {
        if (b == a.email) return !0;
        if (a.providerData) for (var c = 0; c < a.providerData.length; c++) if (b == a.providerData[c].email) return !0;
        return !1
    }

    P.callback = function (a, b, c) {
        var d = new lk;
        d.render(b);
        X(a, d);
        b = c || a.getRedirectResult();
        V(a, b.then(function (e) {
            Yn(a, d, e)
        }, function (e) {
            if (e && ("auth/account-exists-with-different-credential" == e.code || "auth/email-already-in-use" == e.code) && e.email && e.credential) rm(new El(e.email, e.credential), S(a)), co(a, d, e.email); else if (e && "auth/user-cancelled" == e.code) {
                var f = pm(S(a)), g = T(e);
                f && f.va ? co(a, d, f.getEmail(), g) : f ? Ln(a, d, f.getEmail(), g) : bo(a, d, e)
            } else e && "auth/credential-already-in-use" == e.code || (e && "auth/operation-not-supported-in-this-environment" ==
            e.code && un(a) ? Yn(a, d, {user: null, credential: null}) : bo(a, d, e))
        }))
    };
    P.differentDeviceError = function (a, b) {
        var c = new mk(function () {
            c.i();
            U(a, b)
        });
        c.render(b);
        X(a, c)
    };
    P.emailLinkConfirmation = function (a, b, c, d, e, f) {
        var g = new pk(function () {
            var k = g.oa();
            k ? (g.i(), d(a, b, k, c)) : g.w().focus()
        }, function () {
            g.i();
            U(a, b, e || void 0)
        }, e || void 0, R(a).T(), R(a).S());
        g.render(b);
        X(a, g);
        f && g.H(f)
    };
    P.emailLinkNewDeviceLinking = function (a, b, c, d) {
        var e = new cl(c);
        c = e.cc();
        gl(e, null);
        if (c) {
            var f = new rk(Im(R(a), c), function () {
                f.i();
                d(a, b, e.toString())
            }, R(a).T(), R(a).S());
            f.render(b);
            X(a, f)
        } else U(a, b)
    };

    function fo(a, b, c, d, e) {
        var f = new kk, g = new cl(c), k = g.W.V.get(O.se) || "", l = g.W.V.get(O.td) || "",
            n = "1" === g.W.V.get(O.rd), m = fl(g), u = g.cc();
        g = g.kb();
        a.ge(g);
        var y = !hm(fm, S(a)), F = d || um(l, S(a)), ta = (d = vm(l, S(a))) && d.va;
        u && ta && ta.providerId !== u && (ta = null);
        f.render(b);
        X(a, f);
        V(a, f.aa(function () {
                var Z = C(null);
                Z = m && y || y && n ? mf(Error("anonymous-user-not-found")) : go(a, c).then(function (Ob) {
                    if (u && !ta) throw Error("pending-credential-not-found");
                    return Ob
                });
                var ma = null;
                return Z.then(function (Ob) {
                    ma = Ob;
                    return e ? null : a.v().checkActionCode(k)
                }).then(function () {
                    return ma
                })
            },
            [], function (Z) {
                F ? ho(a, f, F, c, ta, Z) : n ? (f.i(), Q("differentDeviceError", a, b)) : (f.i(), Q("emailLinkConfirmation", a, b, c, io))
            }, function (Z) {
                var ma = void 0;
                if (!Z || !Z.name || "cancel" != Z.name) switch (f.i(), Z && Z.message) {
                    case "anonymous-user-not-found":
                        Q("differentDeviceError", a, b);
                        break;
                    case "anonymous-user-mismatch":
                        Q("anonymousUserMismatch", a, b);
                        break;
                    case "pending-credential-not-found":
                        Q("emailLinkNewDeviceLinking", a, b, c, jo);
                        break;
                    default:
                        Z && (ma = T(Z)), U(a, b, void 0, ma)
                }
            }))
    }

    function io(a, b, c, d) {
        fo(a, b, d, c, !0)
    }

    function jo(a, b, c) {
        fo(a, b, c)
    }

    function ho(a, b, c, d, e, f) {
        var g = M(b);
        b.Lb("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", "Signing in...".toString());
        var k = null;
        e = (f ? ko(a, f, c, d, e) : a.signInWithEmailLink(c, d, e)).then(function (l) {
            im(gm, S(a));
            im(fm, S(a));
            b.da();
            b.Lb("firebaseui-icon-done", "Signed in!".toString());
            k = setTimeout(function () {
                b.da();
                yn(a, b, l, !0)
            }, 1E3);
            V(a, function () {
                b && (b.da(), b.i());
                clearTimeout(k)
            })
        }, function (l) {
            b.da();
            b.i();
            if (!l.name || "cancel" != l.name) {
                var n = T(l);
                "auth/email-already-in-use" == l.code || "auth/credential-already-in-use" == l.code ? (im(gm, S(a)), im(fm, S(a))) : "auth/invalid-email" == l.code ? (n = "The email provided does not match the current sign-in session.".toString(), Q("emailLinkConfirmation", a, g, d, io, null, n)) : U(a, g, c, n)
            }
        });
        V(a, e)
    }

    P.emailLinkSignInCallback = fo;

    function lo(a, b, c, d) {
        var e = M(b);
        Mn(a, b, c, function () {
            U(a, e, c)
        }, function (f) {
            if (!f.name || "cancel" != f.name) {
                var g = T(f);
                f && "auth/network-request-failed" == f.code ? b.H(g) : (b.i(), U(a, e, c, g))
            }
        }, d)
    }

    P.emailLinkSignInLinking = function (a, b, c) {
        var d = pm(S(a));
        qm(S(a));
        if (d) {
            var e = d.va.providerId, f = new qk(c, Im(R(a), e), function () {
                lo(a, f, c, d)
            }, R(a).T(), R(a).S());
            f.render(b);
            X(a, f)
        } else U(a, b)
    };
    P.emailLinkSignInSent = function (a, b, c, d, e) {
        var f = new sk(c, function () {
            f.i();
            Q("emailNotReceived", a, b, c, d, e)
        }, function () {
            f.i();
            d()
        }, R(a).T(), R(a).S());
        f.render(b);
        X(a, f)
    };
    P.emailMismatch = function (a, b, c) {
        var d = pm(S(a));
        if (d) {
            var e = new tk(c.user.email, d.getEmail(), function () {
                var f = e;
                qm(S(a));
                yn(a, f, c)
            }, function () {
                var f = c.credential.providerId, g = M(e);
                e.i();
                d.va ? Q("federatedLinking", a, g, d.getEmail(), f) : Q("federatedSignIn", a, g, d.getEmail(), f)
            }, R(a).T(), R(a).S());
            e.render(b);
            X(a, e)
        } else U(a, b)
    };
    P.emailNotReceived = function (a, b, c, d, e) {
        var f = new uk(function () {
            Mn(a, f, c, d, function (g) {
                g = T(g);
                f.H(g)
            }, e)
        }, function () {
            f.i();
            U(a, b, c)
        }, R(a).T(), R(a).S());
        f.render(b);
        X(a, f)
    };
    P.federatedLinking = function (a, b, c, d, e) {
        var f = pm(S(a));
        if (f && f.va) {
            var g = new vk(c, Im(R(a), d), function () {
                En(a, g, d, c)
            }, R(a).T(), R(a).S());
            g.render(b);
            X(a, g);
            e && g.H(e)
        } else U(a, b)
    };
    P.federatedRedirect = function (a, b, c) {
        var d = new kk;
        d.render(b);
        X(a, d);
        b = Hm(R(a))[0];
        En(a, d, b, c)
    };
    P.federatedSignIn = function (a, b, c, d, e) {
        var f = new vk(c, Im(R(a), d), function () {
            En(a, f, d, c)
        }, R(a).T(), R(a).S());
        f.render(b);
        X(a, f);
        e && f.H(e)
    };

    function mo(a, b, c, d) {
        var e = b.Ad();
        e ? V(a, b.aa(t(a.Nh, a), [c, e], function (f) {
            f = f.user.linkWithCredential(d).then(function (g) {
                return yn(a, b, {
                    user: g.user,
                    credential: d,
                    operationType: g.operationType,
                    additionalUserInfo: g.additionalUserInfo
                })
            });
            V(a, f);
            return f
        }, function (f) {
            if (!f.name || "cancel" != f.name) switch (f.code) {
                case "auth/wrong-password":
                    H(b.Ka(), !1);
                    $h(b.Jd(), T(f));
                    break;
                case "auth/too-many-requests":
                    b.H(T(f));
                    break;
                default:
                    Pf("signInWithEmailAndPassword: " + f.message, void 0), b.H(T(f))
            }
        })) : b.Ka().focus()
    }

    P.passwordLinking = function (a, b, c) {
        var d = pm(S(a));
        qm(S(a));
        var e = d && d.va;
        if (e) {
            var f = new Fk(c, function () {
                mo(a, f, c, e)
            }, function () {
                f.i();
                Q("passwordRecovery", a, b, c)
            }, R(a).T(), R(a).S());
            f.render(b);
            X(a, f)
        } else U(a, b)
    };

    function no(a, b) {
        var c = b.oa();
        if (c) {
            var d = M(b);
            V(a, b.aa(t(a.v().sendPasswordResetEmail, a.v()), [c], function () {
                b.i();
                var e = new wk(c, function () {
                    e.i();
                    U(a, d)
                }, R(a).T(), R(a).S());
                e.render(d);
                X(a, e)
            }, function (e) {
                H(b.w(), !1);
                $h(b.$a(), T(e))
            }))
        } else b.w().focus()
    }

    P.passwordRecovery = function (a, b, c, d, e) {
        var f = new Gk(function () {
            no(a, f)
        }, d ? void 0 : function () {
            f.i();
            U(a, b)
        }, c, R(a).T(), R(a).S());
        f.render(b);
        X(a, f);
        e && f.H(e)
    };
    P.passwordSignIn = function (a, b, c, d) {
        var e = new Ik(function () {
            In(a, e)
        }, function () {
            var f = e.getEmail();
            e.i();
            Q("passwordRecovery", a, b, f)
        }, c, R(a).T(), R(a).S(), d);
        e.render(b);
        X(a, e)
    };

    function oo(a, b) {
        var c = Vm(R(a)), d = b.oa(), e = null;
        c && (e = b.vg());
        var f = b.zd();
        if (d) {
            if (c) if (e) e = bc(e); else {
                b.bc().focus();
                return
            }
            if (f) {
                var g = firebase.auth.EmailAuthProvider.credential(d, f);
                V(a, b.aa(t(a.Oh, a), [d, f], function (k) {
                    var l = {
                        user: k.user,
                        credential: g,
                        operationType: k.operationType,
                        additionalUserInfo: k.additionalUserInfo
                    };
                    return c ? (k = k.user.updateProfile({displayName: e}).then(function () {
                        return yn(a, b, l)
                    }), V(a, k), k) : yn(a, b, l)
                }, function (k) {
                    if (!k.name || "cancel" != k.name) {
                        var l = T(k);
                        switch (k.code) {
                            case "auth/email-already-in-use":
                                return po(a,
                                    b, d, k);
                            case "auth/too-many-requests":
                                l = "Too many account requests are coming from your IP address. Try again in a few minutes.".toString();
                            case "auth/operation-not-allowed":
                            case "auth/weak-password":
                                H(b.ya(), !1);
                                $h(b.Id(), l);
                                break;
                            default:
                                k = "setAccountInfo: " + Jf(k), Pf(k, void 0), b.H(l)
                        }
                    }
                }))
            } else b.ya().focus()
        } else b.w().focus()
    }

    function po(a, b, c, d) {
        function e() {
            var g = T(d);
            H(b.w(), !1);
            $h(b.$a(), g);
            b.w().focus()
        }

        var f = a.v().fetchSignInMethodsForEmail(c).then(function (g) {
            g.length ? e() : (g = M(b), b.i(), Q("passwordRecovery", a, g, c, !1, ki().toString()))
        }, function () {
            e()
        });
        V(a, f);
        return f
    }

    P.passwordSignUp = function (a, b, c, d, e, f) {
        function g() {
            k.i();
            U(a, b)
        }

        var k = new Jk(Vm(R(a)), function () {
            oo(a, k)
        }, e ? void 0 : g, c, d, R(a).T(), R(a).S(), f);
        k.render(b);
        X(a, k)
    };

    function qo(a, b, c, d) {
        function e(g) {
            b.Kd().focus();
            H(b.Kd(), !1);
            $h(b.Qg(), g)
        }

        var f = b.wg();
        f ? (b.Lb("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", "Verifying...".toString()), V(a, b.aa(t(d.confirm, d), [f], function (g) {
            b.da();
            b.Lb("firebaseui-icon-done", "Verified!".toString());
            var k = setTimeout(function () {
                b.da();
                b.i();
                var l = {
                    user: ro(a).currentUser,
                    credential: null,
                    operationType: g.operationType,
                    additionalUserInfo: g.additionalUserInfo
                };
                yn(a, b, l, !0)
            }, 1E3);
            V(a, function () {
                b && b.da();
                clearTimeout(k)
            })
        }, function (g) {
            if (g.name && "cancel" == g.name) b.da(); else {
                var k = T(g);
                switch (g.code) {
                    case "auth/credential-already-in-use":
                        b.da();
                        break;
                    case "auth/code-expired":
                        g = M(b);
                        b.da();
                        b.i();
                        Q("phoneSignInStart", a, g, c, k);
                        break;
                    case "auth/missing-verification-code":
                    case "auth/invalid-verification-code":
                        b.da();
                        e(k);
                        break;
                    default:
                        b.da(), b.H(k)
                }
            }
        }))) : e("Wrong code. Try again.".toString())
    }

    P.phoneSignInFinish = function (a, b, c, d, e, f) {
        var g = new Kk(function () {
            g.i();
            Q("phoneSignInStart", a, b, c)
        }, function () {
            qo(a, g, c, e)
        }, function () {
            g.i();
            U(a, b)
        }, function () {
            g.i();
            Q("phoneSignInStart", a, b, c)
        }, ej(c), d, R(a).T(), R(a).S());
        g.render(b);
        X(a, g);
        f && g.H(f)
    };

    function so(a, b, c, d) {
        try {
            var e = b.Rg(ln)
        } catch (f) {
            return
        }
        e ? jn ? (b.Lb("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", "Verifying...".toString()), V(a, b.aa(t(a.Th, a), [ej(e), c], function (f) {
            var g = M(b);
            b.Lb("firebaseui-icon-done", "Code sent!".toString());
            var k = setTimeout(function () {
                b.da();
                b.i();
                Q("phoneSignInFinish", a, g, e, 15, f)
            }, 1E3);
            V(a, function () {
                b && b.da();
                clearTimeout(k)
            })
        }, function (f) {
            b.da();
            if (!f.name || "cancel" != f.name) {
                grecaptcha.reset(mn);
                jn =
                    null;
                var g = f && f.message || "";
                if (f.code) switch (f.code) {
                    case "auth/too-many-requests":
                        g = "This phone number has been used too many times".toString();
                        break;
                    case "auth/invalid-phone-number":
                    case "auth/missing-phone-number":
                        b.ib().focus();
                        $h(b.Se(), ii().toString());
                        return;
                    default:
                        g = T(f)
                }
                b.H(g)
            }
        }))) : kn ? $h(b.Ld(), "Solve the reCAPTCHA".toString()) : !kn && d && b.C().click() : (b.ib().focus(), $h(b.Se(), ii().toString()))
    }

    P.phoneSignInStart = function (a, b, c, d) {
        var e = Om(R(a)) || {};
        jn = null;
        kn = !(e && "invisible" === e.size);
        var f = Jn(a), g = Tm(R(a)), k = f ? Sm(R(a)) : null;
        g = c && c.Fc || g && g.b || null;
        c = c && c.Oa || k;
        (k = Um(R(a))) && Th(k);
        ln = k ? new Oh(Um(R(a))) : Uh;
        var l = new Lk(function (m) {
            so(a, l, n, !(!m || !m.keyCode))
        }, kn, f ? null : function () {
            n.clear();
            l.i();
            U(a, b)
        }, R(a).T(), R(a).S(), f, ln, g, c);
        l.render(b);
        X(a, l);
        d && l.H(d);
        e.callback = function (m) {
            l.Ld() && Zh(l.Ld());
            jn = m;
            kn || so(a, l, n)
        };
        e["expired-callback"] = function () {
            jn = null
        };
        var n = new firebase.auth.RecaptchaVerifier(kn ?
            l.Sg() : l.C(), e, ro(a).app);
        V(a, l.aa(t(n.render, n), [], function (m) {
            mn = m
        }, function (m) {
            m.name && "cancel" == m.name || (m = T(m), l.i(), U(a, b, void 0, m))
        }))
    };
    P.providerSignIn = function (a, b, c, d) {
        var e = new Nk(function (f) {
            f == firebase.auth.EmailAuthProvider.PROVIDER_ID ? (e.i(), Kn(a, b, d)) : f == firebase.auth.PhoneAuthProvider.PROVIDER_ID ? (e.i(), Q("phoneSignInStart", a, b)) : "anonymous" == f ? Gn(a, e) : En(a, e, f, d);
            W(a);
            a.Md.cancel()
        }, Jm(R(a)), R(a).T(), R(a).S());
        e.render(b);
        X(a, e);
        c && e.H(c);
        to(a)
    };
    P.sendEmailLinkForSignIn = function (a, b, c, d) {
        var e = new lk;
        e.render(b);
        X(a, e);
        Mn(a, e, c, d, function (f) {
            e.i();
            f = T(f);
            Q("signIn", a, b, c, f)
        })
    };
    P.signIn = function (a, b, c, d) {
        var e = un(a), f = e && !fn(R(a)), g = new Rk(function () {
            var k = g, l = k.oa() || "";
            l && Ln(a, k, l)
        }, f ? null : function () {
            g.i();
            U(a, b, c)
        }, c, R(a).T(), R(a).S(), e);
        g.render(b);
        X(a, g);
        d && g.H(d)
    };
    P.unsupportedProvider = function (a, b, c) {
        var d = new Tk(c, function () {
            d.i();
            Q("passwordRecovery", a, b, c)
        }, function () {
            d.i();
            U(a, b, c)
        }, R(a).T(), R(a).S());
        d.render(b);
        X(a, d)
    };

    function uo(a, b) {
        this.He = !1;
        var c = vo(b);
        if (wo[c]) throw Error('An AuthUI instance already exists for the key "' + c + '"');
        wo[c] = this;
        this.ua = a;
        this.kf = null;
        this.Ud = !1;
        xo(this.ua);
        this.Pa = firebase.initializeApp({
            apiKey: a.app.options.apiKey,
            authDomain: a.app.options.authDomain
        }, a.app.name + "-firebaseui-temp").auth();
        xo(this.Pa);
        this.Pa.setPersistence && this.Pa.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        this.kg = b;
        this.g = new ym;
        this.P = this.od = this.jb = this.wc = this.md = null;
        this.bb = [];
        this.we = !1;
        this.Md =
            ul.Hd();
        this.Za = this.qc = null;
        this.Lf = this.gc = !1
    }

    function xo(a) {
        a && a.INTERNAL && a.INTERNAL.logFramework && a.INTERNAL.logFramework("FirebaseUI-web")
    }

    var wo = {};

    function vo(a) {
        return a || "[DEFAULT]"
    }

    uo.prototype.getRedirectResult = function () {
        W(this);
        if (!this.jb) {
            var a = this;
            this.jb = yo(this, function (b) {
                return b && !pm(S(a)) ? C(ro(a).getRedirectResult().then(function (c) {
                    return c
                }, function (c) {
                    if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c;
                    return zo(a, c)
                })) : C(a.v().getRedirectResult().then(function (c) {
                    return Dm(R(a)) && !c.user && a.Za && !a.Za.isAnonymous ? ro(a).getRedirectResult() : c
                }))
            })
        }
        return this.jb
    };

    function X(a, b) {
        W(a);
        a.P = b
    }

    var Ao = null;

    function Nn() {
        return Ao
    }

    h = uo.prototype;
    h.v = function () {
        W(this);
        return this.Pa
    };

    function ro(a) {
        W(a);
        return a.ua
    }

    function S(a) {
        W(a);
        return a.kg
    }

    function Tn(a) {
        W(a);
        return a.md ? a.md.emailHint : void 0
    }

    h.Ze = function () {
        W(this);
        return !!sm(S(this)) || Bo(ql())
    };

    function Bo(a) {
        a = new cl(a);
        return "signIn" === (a.W.V.get(O.Yf) || null) && !!a.W.V.get(O.se)
    }

    h.start = function (a, b) {
        Co(this, a, b)
    };

    function Co(a, b, c, d) {
        W(a);
        "undefined" !== typeof a.ua.languageCode && (a.kf = a.ua.languageCode);
        var e = "en".replace(/_/g, "-");
        a.ua.languageCode = e;
        a.Pa.languageCode = e;
        a.Ud = !0;
        "undefined" !== typeof a.ua.tenantId && (a.Pa.tenantId = a.ua.tenantId);
        a.Kb(c);
        a.md = d || null;
        var f = q.document;
        a.qc ? a.qc.then(function () {
            "complete" == f.readyState ? Do(a, b) : Ee(window, "load", function () {
                Do(a, b)
            })
        }) : "complete" == f.readyState ? Do(a, b) : Ee(window, "load", function () {
            Do(a, b)
        })
    }

    function Do(a, b) {
        var c = pl(b, "Could not find the FirebaseUI widget element on the page.");
        c.setAttribute("lang", "en".replace(/_/g, "-"));
        if (Ao) {
            var d = Ao;
            W(d);
            pm(S(d)) && Dl("UI Widget is already rendered on the page and is pending some user interaction. Only one widget instance can be rendered per page. The previous instance has been automatically reset.");
            Ao.reset()
        }
        Ao = a;
        a.od = c;
        Eo(a, c);
        Zg(new $g) && Zg(new ah) ? Sn(a, b) : (b = pl(b, "Could not find the FirebaseUI widget element on the page."), c = new Ek("The browser you are using does not support Web Storage. Please try again in a different browser.".toString()),
            c.render(b), X(a, c));
        sm(S(a)) && (b = sm(S(a)), a.ge(b.kb()), im(bm, S(a)))
    }

    function yo(a, b) {
        if (a.gc) return b(Fo(a));
        V(a, function () {
            a.gc = !1
        });
        if (Dm(R(a))) {
            var c = new B(function (d) {
                V(a, a.ua.onAuthStateChanged(function (e) {
                    a.Za = e;
                    a.gc || (a.gc = !0, d(b(Fo(a))))
                }))
            });
            V(a, c);
            return c
        }
        a.gc = !0;
        return b(null)
    }

    function Fo(a) {
        W(a);
        return Dm(R(a)) && a.Za && a.Za.isAnonymous ? a.Za : null
    }

    function V(a, b) {
        W(a);
        if (b) {
            a.bb.push(b);
            var c = function () {
                Va(a.bb, function (d) {
                    return d == b
                })
            };
            "function" != typeof b && b.then(c, c)
        }
    }

    h.disableAutoSignIn = function () {
        W(this);
        this.we = !0
    };

    function Go(a) {
        W(a);
        var b;
        (b = a.we) || (a = R(a), a = Rm(a, firebase.auth.GoogleAuthProvider.PROVIDER_ID), b = !(!a || "select_account" !== a.prompt));
        return b
    }

    function zn(a) {
        "undefined" !== typeof a.ua.languageCode && a.Ud && (a.Ud = !1, a.ua.languageCode = a.kf)
    }

    h.ge = function (a) {
        this.ua.tenantId = a;
        this.Pa.tenantId = a
    };
    h.kb = function () {
        return this.Pa.tenantId || null
    };
    h.reset = function () {
        W(this);
        var a = this;
        this.od && this.od.removeAttribute("lang");
        this.wc && this.wc.unregister();
        zn(this);
        this.md = null;
        Un();
        im(bm, S(this));
        W(this);
        this.Md.cancel();
        this.jb = C({user: null, credential: null});
        Ao == this && (Ao = null);
        this.od = null;
        for (var b = 0; b < this.bb.length; b++) if ("function" == typeof this.bb[b]) this.bb[b](); else this.bb[b].cancel && this.bb[b].cancel();
        this.bb = [];
        qm(S(this));
        this.P && (this.P.i(), this.P = null);
        this.Gc = null;
        this.Pa && (this.qc = eo(this).then(function () {
            a.qc = null
        }, function () {
            a.qc =
                null
        }))
    };

    function Eo(a, b) {
        a.Gc = null;
        a.wc = new uj(b);
        a.wc.register();
        De(a.wc, "pageEnter", function (c) {
            c = c && c.pageId;
            if (a.Gc != c) {
                var d = R(a);
                (d = cn(d).uiChanged || null) && d(a.Gc, c);
                a.Gc = c
            }
        })
    }

    h.Kb = function (a) {
        W(this);
        this.g.Kb(a);
        !this.Lf && dn(R(this)) && (Dl("signInSuccess callback is deprecated. Please use signInSuccessWithAuthResult callback instead."), this.Lf = !0)
    };

    function R(a) {
        W(a);
        return a.g
    }

    h.signIn = function () {
        W(this);
        var a = R(this), b = il(a.g, "widgetUrl");
        var c = Bm(a, b);
        R(this).g.get("popupMode") ? (a = (window.screen.availHeight - 600) / 2, b = (window.screen.availWidth - 500) / 2, c = c || "about:blank", a = {
            width: 500,
            height: 600,
            top: 0 < a ? a : 0,
            left: 0 < b ? b : 0,
            location: !0,
            resizable: !0,
            statusbar: !0,
            toolbar: !1
        }, a.target = a.target || c.target || "google_popup", a.width = a.width || 690, a.height = a.height || 500, (a = ie(c, a)) && a.focus()) : ac(window.location, c)
    };

    function W(a) {
        if (a.He) throw Error("AuthUI instance is deleted!");
    }

    h["delete"] = function () {
        var a = this;
        W(this);
        return this.Pa.app["delete"]().then(function () {
            var b = vo(S(a));
            delete wo[b];
            a.reset();
            a.He = !0
        })
    };

    function to(a) {
        W(a);
        try {
            a.Md.show(Lm(R(a)), Go(a)).then(function (b) {
                return a.P ? Hn(a, a.P, b) : !1
            })
        } catch (b) {
        }
    }

    h.sendSignInLinkToEmail = function (a, b) {
        W(this);
        var c = this, d = sl();
        if (!Wm(R(this))) throw Error("Email link sign-in should be enabled to trigger email sending.");
        var e = Ym(R(this)), f = new cl(e.url);
        dl(f, d);
        b && b.va && (wm(d, b, S(this)), gl(f, b.va.providerId));
        el(f, Xm(R(this)));
        return yo(this, function (g) {
            g && ((g = g.uid) ? Fg(f.W, O.qd, g) : f.W.removeParameter(O.qd));
            e.url = f.toString();
            return c.v().sendSignInLinkToEmail(a, e)
        }).then(function () {
            var g = S(c), k = {};
            k.email = a;
            jm(fm, kl(d, JSON.stringify(k)), g)
        }, function (g) {
            im(gm,
                S(c));
            im(fm, S(c));
            throw g;
        })
    };

    function go(a, b) {
        var c = fl(new cl(b));
        if (!c) return C(null);
        b = new B(function (d, e) {
            var f = ro(a).onAuthStateChanged(function (g) {
                f();
                g && g.isAnonymous && g.uid === c ? d(g) : g && g.isAnonymous && g.uid !== c ? e(Error("anonymous-user-mismatch")) : e(Error("anonymous-user-not-found"))
            });
            V(a, f)
        });
        V(a, b);
        return b
    }

    function ko(a, b, c, d, e) {
        W(a);
        var f = e || null, g = firebase.auth.EmailAuthProvider.credentialWithLink(c, d);
        c = f ? a.v().signInWithEmailLink(c, d).then(function (k) {
            return k.user.linkWithCredential(f)
        }).then(function () {
            return eo(a)
        }).then(function () {
            return zo(a, {code: "auth/email-already-in-use"}, f)
        }) : a.v().fetchSignInMethodsForEmail(c).then(function (k) {
            return k.length ? zo(a, {code: "auth/email-already-in-use"}, g) : b.linkWithCredential(g)
        });
        V(a, c);
        return c
    }

    h.signInWithEmailLink = function (a, b, c) {
        W(this);
        var d = c || null, e, f = this;
        a = this.v().signInWithEmailLink(a, b).then(function (g) {
            e = {
                user: g.user,
                credential: null,
                operationType: g.operationType,
                additionalUserInfo: g.additionalUserInfo
            };
            if (d) return g.user.linkWithCredential(d).then(function (k) {
                e = {
                    user: k.user,
                    credential: d,
                    operationType: e.operationType,
                    additionalUserInfo: k.additionalUserInfo
                }
            })
        }).then(function () {
            eo(f)
        }).then(function () {
            return ro(f).updateCurrentUser(e.user)
        }).then(function () {
            e.user = ro(f).currentUser;
            return e
        });
        V(this, a);
        return a
    };

    function Un() {
        var a = ql();
        if (Bo(a)) {
            a = new cl(a);
            for (var b in O) O.hasOwnProperty(b) && a.W.removeParameter(O[b]);
            b = {state: "signIn", mode: "emailLink", operation: "clear"};
            var c = q.document.title;
            q.history && q.history.replaceState && q.history.replaceState(b, c, a.toString())
        }
    }

    h.Sh = function (a, b) {
        W(this);
        var c = this;
        return this.v().signInWithEmailAndPassword(a, b).then(function (d) {
            return yo(c, function (e) {
                return e ? eo(c).then(function () {
                    return zo(c, {code: "auth/email-already-in-use"}, firebase.auth.EmailAuthProvider.credential(a, b))
                }) : d
            })
        })
    };
    h.Oh = function (a, b) {
        W(this);
        var c = this;
        return yo(this, function (d) {
            if (d) {
                var e = firebase.auth.EmailAuthProvider.credential(a, b);
                return d.linkWithCredential(e)
            }
            return c.v().createUserWithEmailAndPassword(a, b)
        })
    };
    h.Rh = function (a) {
        W(this);
        var b = this;
        return yo(this, function (c) {
            return c ? c.linkWithCredential(a).then(function (d) {
                return d
            }, function (d) {
                if (d && "auth/email-already-in-use" == d.code && d.email && d.credential) throw d;
                return zo(b, d, a)
            }) : b.v().signInWithCredential(a)
        })
    };

    function Fn(a, b) {
        W(a);
        return yo(a, function (c) {
            return c && !pm(S(a)) ? c.linkWithPopup(b).then(function (d) {
                return d
            }, function (d) {
                if (d && "auth/email-already-in-use" == d.code && d.email && d.credential) throw d;
                return zo(a, d)
            }) : a.v().signInWithPopup(b)
        })
    }

    h.Uh = function (a) {
        W(this);
        var b = this, c = this.jb;
        this.jb = null;
        return yo(this, function (d) {
            return d && !pm(S(b)) ? d.linkWithRedirect(a) : b.v().signInWithRedirect(a)
        }).then(function () {
        }, function (d) {
            b.jb = c;
            throw d;
        })
    };
    h.Th = function (a, b) {
        W(this);
        var c = this;
        return yo(this, function (d) {
            return d ? d.linkWithPhoneNumber(a, b).then(function (e) {
                return new Gl(e, function (f) {
                    if ("auth/credential-already-in-use" == f.code) return zo(c, f);
                    throw f;
                })
            }) : ro(c).signInWithPhoneNumber(a, b).then(function (e) {
                return new Gl(e)
            })
        })
    };
    h.Qh = function () {
        W(this);
        return ro(this).signInAnonymously()
    };

    function Bn(a, b) {
        W(a);
        return yo(a, function (c) {
            if (a.Za && !a.Za.isAnonymous && Dm(R(a)) && !a.v().currentUser) return eo(a).then(function () {
                "password" == b.credential.providerId && (b.credential = null);
                return b
            });
            if (c) return eo(a).then(function () {
                return c.linkWithCredential(b.credential)
            }).then(function (d) {
                b.user = d.user;
                b.credential = d.credential;
                b.operationType = d.operationType;
                b.additionalUserInfo = d.additionalUserInfo;
                return b
            }, function (d) {
                if (d && "auth/email-already-in-use" == d.code && d.email && d.credential) throw d;
                return zo(a, d, b.credential)
            });
            if (!b.user) throw Error('Internal error: An incompatible or outdated version of "firebase.js" may be used.');
            return eo(a).then(function () {
                return ro(a).updateCurrentUser(b.user)
            }).then(function () {
                b.user = ro(a).currentUser;
                b.operationType = "signIn";
                b.credential && b.credential.providerId && "password" == b.credential.providerId && (b.credential = null);
                return b
            })
        })
    }

    h.Nh = function (a, b) {
        W(this);
        return this.v().signInWithEmailAndPassword(a, b)
    };

    function eo(a) {
        W(a);
        return a.v().signOut()
    }

    function zo(a, b, c) {
        W(a);
        if (b && b.code && ("auth/email-already-in-use" == b.code || "auth/credential-already-in-use" == b.code)) {
            var d = Em(R(a));
            return C().then(function () {
                return d(new xm("anonymous-upgrade-merge-conflict", null, c || b.credential))
            }).then(function () {
                a.P && (a.P.i(), a.P = null);
                throw b;
            })
        }
        return mf(b)
    };

    function Ho(a) {
        this.g = new hl;
        this.g.define("authDomain");
        this.g.define("displayMode", "optionFirst");
        this.g.define("tenants");
        this.g.define("callbacks");
        this.g.define("tosUrl");
        this.g.define("privacyPolicyUrl");
        this.Kb(a)
    }

    Ho.prototype.Kb = function (a) {
        for (var b in a) if (a.hasOwnProperty(b)) try {
            this.g.update(b, a[b])
        } catch (c) {
            Pf('Invalid config: "' + b + '"', void 0)
        }
    };

    function Io(a) {
        a = a.g.get("displayMode");
        for (var b in Jo) if (Jo[b] === a) return Jo[b];
        return "optionFirst"
    }

    Ho.prototype.T = function () {
        var a = this.g.get("tosUrl") || null, b = this.g.get("privacyPolicyUrl") || null;
        a && !b && Dl("Privacy Policy URL is missing, the link will not be displayed.");
        if (a && b) {
            if ("function" === typeof a) return a;
            if ("string" === typeof a) return function () {
                ol(a)
            }
        }
        return null
    };
    Ho.prototype.S = function () {
        var a = this.g.get("tosUrl") || null, b = this.g.get("privacyPolicyUrl") || null;
        b && !a && Dl("Terms of Service URL is missing, the link will not be displayed.");
        if (a && b) {
            if ("function" === typeof b) return b;
            if ("string" === typeof b) return function () {
                ol(b)
            }
        }
        return null
    };

    function Ko(a, b) {
        a = a.g.get("tenants");
        if (!a || !a.hasOwnProperty(b)) throw Error("Invalid tenant configuration!");
    }

    function Lo(a, b, c) {
        a = a.g.get("tenants");
        if (!a) throw Error("Invalid tenant configuration!");
        var d = [];
        a = a[b];
        if (!a) return Pf("Invalid tenant configuration: " + (b + " is not configured!"), void 0), d;
        b = a.signInOptions;
        if (!b) throw Error("Invalid tenant configuration: signInOptions are invalid!");
        b.forEach(function (e) {
            if ("string" === typeof e) d.push(e); else if ("string" === typeof e.provider) {
                var f = e.hd;
                f && c ? (f instanceof RegExp ? f : new RegExp("@" + f.replace(".", "\\.") + "$")).test(c) && d.push(e.provider) : d.push(e.provider)
            } else e =
                "Invalid tenant configuration: signInOption " + (JSON.stringify(e) + " is invalid!"), Pf(e, void 0)
        });
        return d
    }

    function Mo(a, b, c) {
        a = No(a, b);
        (b = a.signInOptions) && c && (b = b.filter(function (d) {
            return "string" === typeof d ? c.includes(d) : c.includes(d.provider)
        }), a.signInOptions = b);
        return a
    }

    function No(a, b) {
        var c = Oo;
        var d = void 0 === d ? {} : d;
        a = a.g.get("tenants");
        if (!a || !a.hasOwnProperty(b)) throw Error("Invalid tenant configuration!");
        return tl(a[b], c, d)
    }

    var Oo = ["immediateFederatedRedirect", "privacyPolicyUrl", "signInFlow", "signInOptions", "tosUrl"],
        Jo = {ki: "optionFirst", ii: "identifierFirst"};

    function Po(a, b) {
        var c = this;
        this.Vb = pl(a);
        this.U = {};
        Object.keys(b).forEach(function (d) {
            c.U[d] = new Ho(b[d])
        });
        this.$e = this.P = this.Ea = this.rb = this.ub = this.Ua = null;
        Object.defineProperty(this, "languageCode", {
            get: function () {
                return this.$e
            }, set: function (d) {
                this.$e = d || null
            }, enumerable: !1
        })
    }

    h = Po.prototype;
    h.Dh = function (a, b) {
        var c = this;
        Qo(this);
        var d = a.apiKey;
        return new B(function (e, f) {
            if (c.U.hasOwnProperty(d)) {
                if ("optionFirst" === Io(c.U[d])) {
                    var g = [];
                    b.forEach(function (n) {
                        n = n || "_";
                        var m = c.U[d].g.get("tenants");
                        if (!m) throw Error("Invalid tenant configuration!");
                        (m = m[n]) ? n = {
                            tenantId: "_" !== n ? n : null,
                            displayName: m.displayName,
                            Tc: m.iconUrl,
                            Ac: m.buttonColor
                        } : (Pf("Invalid tenant configuration: " + (n + " is not configured!"), void 0), n = null);
                        n && g.push(n)
                    });
                    var k = function (n) {
                        n = {
                            tenantId: n, providerIds: Lo(c.U[d], n ||
                                "_")
                        };
                        e(n)
                    };
                    if (1 === g.length) {
                        k(g[0].tenantId);
                        return
                    }
                    c.P = new Pk(function (n) {
                        Qo(c);
                        k(n)
                    }, g, c.U[d].T(), c.U[d].S())
                } else c.P = new Mk(function () {
                    var n = c.P.oa();
                    if (n) {
                        for (var m = 0; m < b.length; m++) {
                            var u = Lo(c.U[d], b[m] || "_", n);
                            if (0 !== u.length) {
                                n = {tenantId: b[m], providerIds: u, email: n};
                                Qo(c);
                                e(n);
                                return
                            }
                        }
                        c.P.H(li({code: "no-matching-tenant-for-email"}).toString())
                    }
                }, c.U[d].T(), c.U[d].S());
                c.P.render(c.Vb);
                (f = cn(c.U[d]).selectProviderUiShown || null) && f()
            } else {
                var l = Error("Invalid project configuration: API key is invalid!");
                l.code = "invalid-configuration";
                c.handleError(l);
                f(l)
            }
        })
    };
    h.v = function (a, b) {
        if (!this.U.hasOwnProperty(a)) throw Error("Invalid project configuration: API key is invalid!");
        var c = b || void 0;
        Ko(this.U[a], b || "_");
        try {
            this.ub = firebase.app(c).auth()
        } catch (e) {
            var d = this.U[a].g.get("authDomain");
            if (!d) throw Error("Invalid project configuration: authDomain is required!");
            a = firebase.initializeApp({apiKey: a, authDomain: d}, c);
            a.auth().tenantId = b;
            this.ub = a.auth()
        }
        return this.ub
    };
    h.Ph = function (a, b) {
        var c = this;
        return new B(function (d, e) {
            function f(m, u) {
                c.Ua = new uo(a);
                Co(c.Ua, c.Vb, m, u)
            }

            var g = a.app.options.apiKey;
            c.U.hasOwnProperty(g) || e(Error("Invalid project configuration: API key is invalid!"));
            var k = Mo(c.U[g], a.tenantId || "_", b && b.providerIds);
            Qo(c);
            e = {
                signInSuccessWithAuthResult: function (m) {
                    d(m);
                    return !1
                }
            };
            var l = cn(c.U[g]).signInUiShown || null;
            l && (e.uiShown = function () {
                l(a.tenantId)
            });
            k.callbacks = e;
            k.credentialHelper = "none";
            var n;
            b && b.email && (n = {emailHint: b.email});
            c.Ua ? c.Ua["delete"]().then(function () {
                f(k,
                    n)
            }) : f(k, n)
        })
    };
    h.reset = function () {
        var a = this;
        return C().then(function () {
            a.Ua && a.Ua["delete"]()
        }).then(function () {
            a.Ua = null;
            Qo(a)
        })
    };
    h.Jh = function () {
        var a = this;
        this.rb || this.Ea || (this.Ea = window.setTimeout(function () {
            Qo(a);
            a.rb = new Sk;
            a.P = a.rb;
            a.rb.render(a.Vb);
            a.Ea = null
        }, 500))
    };
    h.We = function () {
        window.clearTimeout(this.Ea);
        this.Ea = null;
        this.rb && (this.rb.i(), this.rb = null)
    };
    h.yg = function () {
        Qo(this);
        this.P = new zk;
        this.P.render(this.Vb);
        return C()
    };

    function Qo(a) {
        a.Ua && a.Ua.reset();
        a.We();
        a.P && a.P.i()
    }

    h.handleError = function (a) {
        var b = this, c = li({code: a.code}).toString() || a.message;
        Qo(this);
        var d;
        a.retry && Ba(a.retry) && (d = function () {
            b.reset();
            a.retry()
        });
        this.P = new Dk(c, d);
        this.P.render(this.Vb)
    };
    h.sh = function (a) {
        var b = this;
        return C().then(function () {
            var c = b.ub && b.ub.app.options.apiKey;
            if (!b.U.hasOwnProperty(c)) throw Error("Invalid project configuration: API key is invalid!");
            Ko(b.U[c], a.tenantId || "_");
            if (!b.ub.currentUser || b.ub.currentUser.uid !== a.uid) throw Error("The user being processed does not match the signed in user!");
            return (c = cn(b.U[c]).beforeSignInSuccess || null) ? c(a) : a
        }).then(function (c) {
            if (c.uid !== a.uid) throw Error("User with mismatching UID returned.");
            return c
        })
    };
    w("firebaseui.auth.FirebaseUiHandler", Po);
    w("firebaseui.auth.FirebaseUiHandler.prototype.selectProvider", Po.prototype.Dh);
    w("firebaseui.auth.FirebaseUiHandler.prototype.getAuth", Po.prototype.v);
    w("firebaseui.auth.FirebaseUiHandler.prototype.startSignIn", Po.prototype.Ph);
    w("firebaseui.auth.FirebaseUiHandler.prototype.reset", Po.prototype.reset);
    w("firebaseui.auth.FirebaseUiHandler.prototype.showProgressBar", Po.prototype.Jh);
    w("firebaseui.auth.FirebaseUiHandler.prototype.hideProgressBar", Po.prototype.We);
    w("firebaseui.auth.FirebaseUiHandler.prototype.completeSignOut", Po.prototype.yg);
    w("firebaseui.auth.FirebaseUiHandler.prototype.handleError", Po.prototype.handleError);
    w("firebaseui.auth.FirebaseUiHandler.prototype.processUser", Po.prototype.sh);
    w("firebaseui.auth.AuthUI", uo);
    w("firebaseui.auth.AuthUI.getInstance", function (a) {
        a = vo(a);
        return wo[a] ? wo[a] : null
    });
    w("firebaseui.auth.AuthUI.prototype.disableAutoSignIn", uo.prototype.disableAutoSignIn);
    w("firebaseui.auth.AuthUI.prototype.start", uo.prototype.start);
    w("firebaseui.auth.AuthUI.prototype.setConfig", uo.prototype.Kb);
    w("firebaseui.auth.AuthUI.prototype.signIn", uo.prototype.signIn);
    w("firebaseui.auth.AuthUI.prototype.reset", uo.prototype.reset);
    w("firebaseui.auth.AuthUI.prototype.delete", uo.prototype["delete"]);
    w("firebaseui.auth.AuthUI.prototype.isPendingRedirect", uo.prototype.Ze);
    w("firebaseui.auth.AuthUIError", xm);
    w("firebaseui.auth.AuthUIError.prototype.toJSON", xm.prototype.toJSON);
    w("firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM", "accountchooser.com");
    w("firebaseui.auth.CredentialHelper.GOOGLE_YOLO", "googleyolo");
    w("firebaseui.auth.CredentialHelper.NONE", "none");
    w("firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID", "anonymous");
    B.prototype["catch"] = B.prototype.Nb;
    B.prototype["finally"] = B.prototype.Wh;/*

 Copyright 2015 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
    var Y = {
        If: function () {
        }, me: function () {
        }, Jf: function () {
        }, le: function () {
        }, rf: function () {
        }, register: function () {
        }, Ne: function () {
        }
    };
    Y = function () {
        function a(m, u) {
            for (var y = 0; y < l.length; y++) if (l[y].className === m) return "undefined" !== typeof u && (l[y] = u), l[y];
            return !1
        }

        function b(m) {
            m = m.getAttribute("data-upgraded");
            return null === m ? [""] : m.split(",")
        }

        function c(m, u) {
            return -1 !== b(m).indexOf(u)
        }

        function d(m, u, y) {
            if ("CustomEvent" in window && "function" === typeof window.CustomEvent) return new CustomEvent(m, {
                bubbles: u,
                cancelable: y
            });
            var F = document.createEvent("Events");
            F.initEvent(m, u, y);
            return F
        }

        function e(m, u) {
            if ("undefined" === typeof m && "undefined" ===
                typeof u) for (m = 0; m < l.length; m++) e(l[m].className, l[m].wa); else {
                if ("undefined" === typeof u) {
                    var y = a(m);
                    y && (u = y.wa)
                }
                u = document.querySelectorAll("." + u);
                for (y = 0; y < u.length; y++) f(u[y], m)
            }
        }

        function f(m, u) {
            if (!("object" === typeof m && m instanceof Element)) throw Error("Invalid argument provided to upgrade MDL element.");
            var y = d("mdl-componentupgrading", !0, !0);
            m.dispatchEvent(y);
            if (!y.defaultPrevented) {
                y = b(m);
                var F = [];
                if (u) c(m, u) || F.push(a(u)); else {
                    var ta = m.classList;
                    l.forEach(function (Ze) {
                        ta.contains(Ze.wa) &&
                        -1 === F.indexOf(Ze) && !c(m, Ze.className) && F.push(Ze)
                    })
                }
                u = 0;
                for (var Z = F.length, ma; u < Z; u++) {
                    if (ma = F[u]) {
                        y.push(ma.className);
                        m.setAttribute("data-upgraded", y.join(","));
                        var Ob = new ma.xg(m);
                        Ob.mdlComponentConfigInternal_ = ma;
                        n.push(Ob);
                        for (var Rg = 0, Ro = ma.yd.length; Rg < Ro; Rg++) ma.yd[Rg](m);
                        ma.wb && (m[ma.className] = Ob)
                    } else throw Error("Unable to find a registered component for the given class.");
                    ma = d("mdl-componentupgraded", !0, !1);
                    m.dispatchEvent(ma)
                }
            }
        }

        function g(m) {
            Array.isArray(m) || (m = m instanceof Element ?
                [m] : Array.prototype.slice.call(m));
            for (var u = 0, y = m.length, F; u < y; u++) F = m[u], F instanceof HTMLElement && (f(F), 0 < F.children.length && g(F.children))
        }

        function k(m) {
            if (m) {
                n.splice(n.indexOf(m), 1);
                var u = m.f.getAttribute("data-upgraded").split(",");
                u.splice(u.indexOf(m.mdlComponentConfigInternal_.yb), 1);
                m.f.setAttribute("data-upgraded", u.join(","));
                u = d("mdl-componentdowngraded", !0, !1);
                m.f.dispatchEvent(u)
            }
        }

        var l = [], n = [];
        return {
            If: e, me: f, Jf: g, le: function () {
                for (var m = 0; m < l.length; m++) e(l[m].className)
            }, rf: function (m,
                             u) {
                (m = a(m)) && m.yd.push(u)
            }, register: function (m) {
                var u = !0;
                if ("undefined" !== typeof m.wb || "undefined" !== typeof m.widget) u = m.wb || m.widget;
                var y = {
                    xg: m.constructor || m.constructor,
                    className: m.yb || m.classAsString,
                    wa: m.wa || m.cssClass,
                    wb: u,
                    yd: []
                };
                l.forEach(function (F) {
                    if (F.wa === y.wa) throw Error("The provided cssClass has already been registered: " + F.wa);
                    if (F.className === y.className) throw Error("The provided className has already been registered");
                });
                if (m.constructor.prototype.hasOwnProperty("mdlComponentConfigInternal_")) throw Error("MDL component classes must not have mdlComponentConfigInternal_ defined as a property.");
                a(m.yb, y) || l.push(y)
            }, Ne: function (m) {
                function u(F) {
                    n.filter(function (ta) {
                        return ta.f === F
                    }).forEach(k)
                }

                if (m instanceof Array || m instanceof NodeList) for (var y = 0; y < m.length; y++) u(m[y]); else if (m instanceof Node) u(m); else throw Error("Invalid argument provided to downgrade MDL nodes.");
            }
        }
    }();
    Y.upgradeDom = Y.If;
    Y.upgradeElement = Y.me;
    Y.upgradeElements = Y.Jf;
    Y.upgradeAllRegistered = Y.le;
    Y.registerUpgradedCallback = Y.rf;
    Y.register = Y.register;
    Y.downgradeElements = Y.Ne;
    window.componentHandler = Y;
    window.addEventListener("load", function () {
        "classList" in document.createElement("div") && "querySelector" in document && "addEventListener" in window && Array.prototype.forEach ? (document.documentElement.classList.add("mdl-js"), Y.le()) : (Y.me = function () {
        }, Y.register = function () {
        })
    });
    (function () {
        function a(b) {
            this.f = b;
            this.init()
        }

        window.MaterialButton = a;
        a.prototype.Qa = {};
        a.prototype.A = {ag: "mdl-js-ripple-effect", $f: "mdl-button__ripple-container", Zf: "mdl-ripple"};
        a.prototype.ye = function (b) {
            b && this.f.blur()
        };
        a.prototype.disable = function () {
            this.f.disabled = !0
        };
        a.prototype.disable = a.prototype.disable;
        a.prototype.enable = function () {
            this.f.disabled = !1
        };
        a.prototype.enable = a.prototype.enable;
        a.prototype.init = function () {
            if (this.f) {
                if (this.f.classList.contains(this.A.ag)) {
                    var b = document.createElement("span");
                    b.classList.add(this.A.$f);
                    this.be = document.createElement("span");
                    this.be.classList.add(this.A.Zf);
                    b.appendChild(this.be);
                    this.sg = this.ye.bind(this);
                    this.be.addEventListener("mouseup", this.sg);
                    this.f.appendChild(b)
                }
                this.ze = this.ye.bind(this);
                this.f.addEventListener("mouseup", this.ze);
                this.f.addEventListener("mouseleave", this.ze)
            }
        };
        Y.register({constructor: a, yb: "MaterialButton", wa: "mdl-js-button", wb: !0})
    })();
    (function () {
        function a(b) {
            this.f = b;
            this.init()
        }

        window.MaterialProgress = a;
        a.prototype.Qa = {};
        a.prototype.A = {Qf: "mdl-progress__indeterminate"};
        a.prototype.Fh = function (b) {
            this.f.classList.contains(this.A.Qf) || (this.mf.style.width = b + "%")
        };
        a.prototype.setProgress = a.prototype.Fh;
        a.prototype.Eh = function (b) {
            this.Be.style.width = b + "%";
            this.xe.style.width = 100 - b + "%"
        };
        a.prototype.setBuffer = a.prototype.Eh;
        a.prototype.init = function () {
            if (this.f) {
                var b = document.createElement("div");
                b.className = "progressbar bar bar1";
                this.f.appendChild(b);
                this.mf = b;
                b = document.createElement("div");
                b.className = "bufferbar bar bar2";
                this.f.appendChild(b);
                this.Be = b;
                b = document.createElement("div");
                b.className = "auxbar bar bar3";
                this.f.appendChild(b);
                this.xe = b;
                this.mf.style.width = "0%";
                this.Be.style.width = "100%";
                this.xe.style.width = "0%";
                this.f.classList.add("is-upgraded")
            }
        };
        Y.register({constructor: a, yb: "MaterialProgress", wa: "mdl-js-progress", wb: !0})
    })();
    (function () {
        function a(b) {
            this.f = b;
            this.init()
        }

        window.MaterialSpinner = a;
        a.prototype.Qa = {Vf: 4};
        a.prototype.A = {
            re: "mdl-spinner__layer",
            qe: "mdl-spinner__circle-clipper",
            Tf: "mdl-spinner__circle",
            Uf: "mdl-spinner__gap-patch",
            Wf: "mdl-spinner__left",
            Xf: "mdl-spinner__right"
        };
        a.prototype.Fe = function (b) {
            var c = document.createElement("div");
            c.classList.add(this.A.re);
            c.classList.add(this.A.re + "-" + b);
            b = document.createElement("div");
            b.classList.add(this.A.qe);
            b.classList.add(this.A.Wf);
            var d = document.createElement("div");
            d.classList.add(this.A.Uf);
            var e = document.createElement("div");
            e.classList.add(this.A.qe);
            e.classList.add(this.A.Xf);
            for (var f = [b, d, e], g = 0; g < f.length; g++) {
                var k = document.createElement("div");
                k.classList.add(this.A.Tf);
                f[g].appendChild(k)
            }
            c.appendChild(b);
            c.appendChild(d);
            c.appendChild(e);
            this.f.appendChild(c)
        };
        a.prototype.createLayer = a.prototype.Fe;
        a.prototype.stop = function () {
            this.f.classList.remove("is-active")
        };
        a.prototype.stop = a.prototype.stop;
        a.prototype.start = function () {
            this.f.classList.add("is-active")
        };
        a.prototype.start = a.prototype.start;
        a.prototype.init = function () {
            if (this.f) {
                for (var b = 1; b <= this.Qa.Vf; b++) this.Fe(b);
                this.f.classList.add("is-upgraded")
            }
        };
        Y.register({constructor: a, yb: "MaterialSpinner", wa: "mdl-js-spinner", wb: !0})
    })();
    (function () {
        function a(b) {
            this.f = b;
            this.jc = this.Qa.sd;
            this.init()
        }

        window.MaterialTextfield = a;
        a.prototype.Qa = {sd: -1, pe: "maxrows"};
        a.prototype.A = {
            ji: "mdl-textfield__label",
            Rf: "mdl-textfield__input",
            ne: "is-dirty",
            xc: "is-focused",
            oe: "is-disabled",
            yc: "is-invalid",
            Sf: "is-upgraded",
            Pf: "has-placeholder"
        };
        a.prototype.ph = function (b) {
            var c = b.target.value.split("\n").length;
            13 === b.keyCode && c >= this.jc && b.preventDefault()
        };
        a.prototype.oh = function () {
            this.f.classList.add(this.A.xc)
        };
        a.prototype.nh = function () {
            this.f.classList.remove(this.A.xc)
        };
        a.prototype.qh = function () {
            this.Ob()
        };
        a.prototype.Ob = function () {
            this.checkDisabled();
            this.checkValidity();
            this.De();
            this.Bd()
        };
        a.prototype.checkDisabled = function () {
            this.Y.disabled ? this.f.classList.add(this.A.oe) : this.f.classList.remove(this.A.oe)
        };
        a.prototype.checkDisabled = a.prototype.checkDisabled;
        a.prototype.Bd = function () {
            this.f.querySelector(":focus") ? this.f.classList.add(this.A.xc) : this.f.classList.remove(this.A.xc)
        };
        a.prototype.checkFocus = a.prototype.Bd;
        a.prototype.checkValidity = function () {
            this.Y.validity &&
            (this.Y.validity.valid ? this.f.classList.remove(this.A.yc) : this.f.classList.add(this.A.yc))
        };
        a.prototype.checkValidity = a.prototype.checkValidity;
        a.prototype.De = function () {
            this.Y.value && 0 < this.Y.value.length ? this.f.classList.add(this.A.ne) : this.f.classList.remove(this.A.ne)
        };
        a.prototype.checkDirty = a.prototype.De;
        a.prototype.disable = function () {
            this.Y.disabled = !0;
            this.Ob()
        };
        a.prototype.disable = a.prototype.disable;
        a.prototype.enable = function () {
            this.Y.disabled = !1;
            this.Ob()
        };
        a.prototype.enable = a.prototype.enable;
        a.prototype.ug = function (b) {
            this.Y.value = b || "";
            this.Ob()
        };
        a.prototype.change = a.prototype.ug;
        a.prototype.init = function () {
            if (this.f && (this.Y = this.f.querySelector("." + this.A.Rf))) {
                this.Y.hasAttribute(this.Qa.pe) && (this.jc = parseInt(this.Y.getAttribute(this.Qa.pe), 10), isNaN(this.jc) && (this.jc = this.Qa.sd));
                this.Y.hasAttribute("placeholder") && this.f.classList.add(this.A.Pf);
                this.tg = this.Ob.bind(this);
                this.pg = this.oh.bind(this);
                this.og = this.nh.bind(this);
                this.rg = this.qh.bind(this);
                this.Y.addEventListener("input",
                    this.tg);
                this.Y.addEventListener("focus", this.pg);
                this.Y.addEventListener("blur", this.og);
                this.Y.addEventListener("reset", this.rg);
                this.jc !== this.Qa.sd && (this.qg = this.ph.bind(this), this.Y.addEventListener("keydown", this.qg));
                var b = this.f.classList.contains(this.A.yc);
                this.Ob();
                this.f.classList.add(this.A.Sf);
                b && this.f.classList.add(this.A.yc);
                this.Y.hasAttribute("autofocus") && (this.f.focus(), this.Bd())
            }
        };
        Y.register({constructor: a, yb: "MaterialTextfield", wa: "mdl-js-textfield", wb: !0})
    })();/*

 Copyright (c) 2013 The Chromium Authors. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

    * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following disclaimer
 in the documentation and/or other materials provided with the
 distribution.
    * Neither the name of Google Inc. nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
    (function () {
        function a(f) {
            for (; f;) {
                if ("DIALOG" == f.nodeName.toUpperCase()) return f;
                f = f.parentElement
            }
            return null
        }

        function b(f) {
            f && f.blur && f != document.body && f.blur()
        }

        function c(f) {
            this.R = f;
            this.Vd = this.jd = !1;
            f.hasAttribute("role") || f.setAttribute("role", "dialog");
            f.show = this.show.bind(this);
            f.showModal = this.showModal.bind(this);
            f.close = this.close.bind(this);
            "returnValue" in f || (f.returnValue = "");
            this.Fb = this.Fb.bind(this);
            "MutationObserver" in window ? (new MutationObserver(this.Fb)).observe(f, {
                attributes: !0,
                attributeFilter: ["open"]
            }) : f.addEventListener("DOMAttrModified", this.Fb);
            Object.defineProperty(f, "open", {set: this.ee.bind(this), get: f.hasAttribute.bind(f, "open")});
            this.Va = document.createElement("div");
            this.Va.className = "backdrop";
            this.zc = this.zc.bind(this)
        }

        var d = window.CustomEvent;
        d && "object" != typeof d || (d = function (f, g) {
            g = g || {};
            var k = document.createEvent("CustomEvent");
            k.initCustomEvent(f, !!g.bubbles, !!g.cancelable, g.detail || null);
            return k
        }, d.prototype = window.Event.prototype);
        c.prototype = {
            get Ie() {
                return this.R
            },
            Fb: function () {
                !this.Vd || this.R.hasAttribute("open") && document.body.contains(this.R) || (this.Vd = !1, this.R.style.zIndex = "", this.jd && (this.R.style.top = "", this.jd = !1), this.Va.removeEventListener("click", this.zc), this.Va.parentElement && this.Va.parentElement.removeChild(this.Va), e.Me.wh(this))
            }, ee: function (f) {
                f ? this.R.hasAttribute("open") || this.R.setAttribute("open", "") : (this.R.removeAttribute("open"), this.Fb())
            }, zc: function (f) {
                var g = document.createEvent("MouseEvents");
                g.initMouseEvent(f.type, f.bubbles,
                    f.cancelable, window, f.detail, f.screenX, f.screenY, f.clientX, f.clientY, f.ctrlKey, f.altKey, f.shiftKey, f.metaKey, f.button, f.relatedTarget);
                this.R.dispatchEvent(g);
                f.stopPropagation()
            }, Ng: function () {
                var f = this.R.querySelector("[autofocus]:not([disabled])");
                f || (f = ["button", "input", "keygen", "select", "textarea"].map(function (g) {
                    return g + ":not([disabled])"
                }), f.push('[tabindex]:not([disabled]):not([tabindex=""])'), f = this.R.querySelector(f.join(", ")));
                b(document.activeElement);
                f && f.focus()
            }, bi: function (f, g) {
                this.Va.style.zIndex =
                    f;
                this.R.style.zIndex = g
            }, show: function () {
                this.R.open || (this.ee(!0), this.Ng())
            }, showModal: function () {
                if (this.R.hasAttribute("open")) throw Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.");
                if (!document.body.contains(this.R)) throw Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");
                if (!e.Me.uh(this)) throw Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs.");
                this.show();
                this.Vd = !0;
                e.lh(this.R) ? (e.xh(this.R), this.jd = !0) : this.jd = !1;
                this.Va.addEventListener("click", this.zc);
                this.R.parentNode.insertBefore(this.Va, this.R.nextSibling)
            }, close: function (f) {
                if (!this.R.hasAttribute("open")) throw Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.");
                this.ee(!1);
                void 0 !== f && (this.R.returnValue = f);
                f = new d("close", {bubbles: !1, cancelable: !1});
                this.R.dispatchEvent(f)
            }
        };
        var e = {
            xh: function (f) {
                var g = document.body.scrollTop ||
                    document.documentElement.scrollTop;
                f.style.top = Math.max(g, g + (window.innerHeight - f.offsetHeight) / 2) + "px"
            }, bh: function (f) {
                for (var g = 0; g < document.styleSheets.length; ++g) {
                    var k = document.styleSheets[g], l = null;
                    try {
                        l = k.cssRules
                    } catch (y) {
                    }
                    if (l) for (k = 0; k < l.length; ++k) {
                        var n = l[k], m = null;
                        try {
                            m = document.querySelectorAll(n.selectorText)
                        } catch (y) {
                        }
                        var u;
                        if (u = m) a:{
                            for (u = 0; u < m.length; ++u) if (m[u] == f) {
                                u = !0;
                                break a
                            }
                            u = !1
                        }
                        if (u && (m = n.style.getPropertyValue("top"), n = n.style.getPropertyValue("bottom"), m && "auto" != m || n && "auto" !=
                        n)) return !0
                    }
                }
                return !1
            }, lh: function (f) {
                return "absolute" != window.getComputedStyle(f).position || "auto" != f.style.top && "" != f.style.top || "auto" != f.style.bottom && "" != f.style.bottom ? !1 : !e.bh(f)
            }, Pe: function (f) {
                f.showModal && console.warn("This browser already supports <dialog>, the polyfill may not work correctly", f);
                if ("DIALOG" != f.nodeName.toUpperCase()) throw Error("Failed to register dialog: The element is not a dialog.");
                new c(f)
            }, vh: function (f) {
                f.showModal || e.Pe(f)
            }, Fa: function () {
                this.ma = [];
                this.pc = document.createElement("div");
                this.pc.className = "_dialog_overlay";
                this.pc.addEventListener("click", function (f) {
                    f.stopPropagation()
                });
                this.Pc = this.Pc.bind(this);
                this.Nc = this.Nc.bind(this);
                this.Qc = this.Qc.bind(this);
                this.Mf = 1E5;
                this.di = 100150
            }
        };
        e.Fa.prototype.Ff = function () {
            return this.ma.length ? this.ma[this.ma.length - 1].Ie : null
        };
        e.Fa.prototype.mg = function () {
            document.body.appendChild(this.pc);
            document.body.addEventListener("focus", this.Nc, !0);
            document.addEventListener("keydown", this.Pc);
            document.addEventListener("DOMNodeRemoved",
                this.Qc)
        };
        e.Fa.prototype.ai = function () {
            document.body.removeChild(this.pc);
            document.body.removeEventListener("focus", this.Nc, !0);
            document.removeEventListener("keydown", this.Pc);
            document.removeEventListener("DOMNodeRemoved", this.Qc)
        };
        e.Fa.prototype.Hf = function () {
            for (var f = this.Mf, g = 0; g < this.ma.length; g++) g == this.ma.length - 1 && (this.pc.style.zIndex = f++), this.ma[g].bi(f++, f++)
        };
        e.Fa.prototype.Nc = function (f) {
            if (a(f.target) != this.Ff()) return f.preventDefault(), f.stopPropagation(), b(f.target), !1
        };
        e.Fa.prototype.Pc =
            function (f) {
                if (27 == f.keyCode) {
                    f.preventDefault();
                    f.stopPropagation();
                    f = new d("cancel", {bubbles: !1, cancelable: !0});
                    var g = this.Ff();
                    g.dispatchEvent(f) && g.close()
                }
            };
        e.Fa.prototype.Qc = function (f) {
            if ("DIALOG" == f.target.nodeName.toUpperCase()) {
                var g = f.target;
                g.open && this.ma.some(function (k) {
                    if (k.Ie == g) return k.Fb(), !0
                })
            }
        };
        e.Fa.prototype.uh = function (f) {
            if (this.ma.length >= (this.di - this.Mf) / 2 - 1) return !1;
            this.ma.push(f);
            1 == this.ma.length && this.mg();
            this.Hf();
            return !0
        };
        e.Fa.prototype.wh = function (f) {
            f = this.ma.indexOf(f);
            -1 != f && (this.ma.splice(f, 1), this.Hf(), 0 == this.ma.length && this.ai())
        };
        e.Me = new e.Fa;
        document.addEventListener("submit", function (f) {
            var g = f.target;
            if (g && g.hasAttribute("method") && "dialog" == g.getAttribute("method").toLowerCase() && (f.preventDefault(), g = a(f.target))) {
                var k, l = ["BUTTON", "INPUT"];
                [document.activeElement, f.explicitOriginalTarget].some(function (n) {
                    if (n && n.form == f.target && -1 != l.indexOf(n.nodeName.toUpperCase())) return k = n.value, !0
                });
                g.close(k)
            }
        }, !0);
        e.forceRegisterDialog = e.Pe;
        e.registerDialog =
            e.vh;
        "function" === typeof define && "amd" in define ? define(function () {
            return e
        }) : "object" === typeof module && "object" === typeof module.exports ? module.exports = e : window.dialogPolyfill = e
    })();
}).call(this);
