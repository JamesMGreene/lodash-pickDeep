/*global describe, context, it, beforeEach, afterEach, expect */

// Userland modules
var _ = require('lodash');

// Local modules
var pickDeep = require('..');


var deepObj = {
      a: {
        b: {
          c: 'foo',
          d: false,
          e: {
            f: [ 'baz' ]
          },
          g: {
            h: 'wat',
            i: null,
            j: undefined
          }
        },
        k: 0,
        l: '',
        m: {},
        n: []
      }
    };

var clonedDeepObj = _.cloneDeep( deepObj );

var abcPickedObj = {
      a: {
        b: {
          c: 'foo'
        }
      }
    };

var abcdemPickedObj = {
      a: {
        b: {
          c: 'foo',
          d: false,
          e: {
            f: [ 'baz' ]
          }
        },
        m: {}
      }
    };

describe( 'lodash-pickDeep', function() {

  context( 'when used on its own (not mixed into lodash)', function() {

    beforeEach(function() {
      // Assert pre-condition
      expect( _ ).to.not.have.property( 'pickDeep' );
    });

    afterEach(function() {
      // Assert post-condition
      expect( _ ).to.not.have.property( 'pickDeep' );
    });


    it( 'should not automatically mix into lodash', function() {
      expect( _ ).to.not.have.property( 'pickDeep' );
    });


    describe( 'pickDeep', function() {

      it( 'should return an empty object for non-object "object" argument values', function() {
        expect( pickDeep( null, [ 'a' ] ) ).to.deep.equal( {} );
      });

      it( 'should not alter the original object', function() {
        expect( deepObj ).to.deep.equal( clonedDeepObj );
        expect( pickDeep( deepObj, [ 'a.b.c' ] ) ).to.deep.equal( abcPickedObj );
        expect( deepObj ).to.deep.equal( clonedDeepObj );
      });

      it( 'should allow for no "props" argument', function() {
        expect( pickDeep( deepObj ) ).to.deep.equal( {} );
      });

      it( 'should allow for a single string "props" argument', function() {
        expect( pickDeep( deepObj, 'a.b.c' ) ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for multiple string "props..." arguments', function() {
        expect( pickDeep( deepObj, 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a single array "props" argument containing a single item', function() {
        expect( pickDeep( deepObj, [ 'a.b.c' ] ) ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for a single array "props" argument containing multiple items', function() {
        expect( pickDeep( deepObj, [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing a single item', function() {
        expect( pickDeep( deepObj, [ 'a.b.c' ], [ 'a.b.d' ], [ 'a.b.e' ], [ 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing multiple items', function() {
        expect( pickDeep( deepObj, [ 'a.b.c', 'a.b.d' ], [ 'a.b.e', 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a combination of string and array "props..." arguments', function() {
        expect( pickDeep( deepObj, 'a.b.c', [ 'a.b.d', 'a.b.e' ], 'a.m' ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should gracefully ignored unmatched paths in the "props" argument', function() {
        expect( pickDeep( deepObj, [ 'x.y.z' ] ) ).to.deep.equal( {} );
        expect( pickDeep( deepObj, [ 'a.b.c', 'x.y.z' ] ) ).to.deep.equal( abcPickedObj );
        expect( pickDeep( deepObj, [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m', 'x.y.z', 'a.q.u.a' ] ) ).to.deep.equal( abcdemPickedObj );
      });

    });

  });


  context( 'when used as a lodash mixin', function() {

    it( 'should be manually mixable into lodash', function() {
      // Assert pre-conditions
      expect( _ ).to.not.have.property( 'pickDeep' );

      // Act
      _.mixin( { pickDeep: pickDeep }, { chain: true } );

      // Assert
      expect( _ ).to.have.property( 'pickDeep' );
      expect( _.pickDeep ).to.be.a( 'function' );
      expect( _.pickDeep ).to.equal( pickDeep );

      var _chainedObj = _.chain( deepObj );
      expect( _chainedObj ).to.have.property( 'pickDeep' );
      expect( _chainedObj.pickDeep ).to.be.a( 'function' );
      expect( _chainedObj.pickDeep ).to.not.equal( pickDeep );
    });


    describe( '_.pickDeep', function() {

      beforeEach(function() {
        // Assert pre-condition
        expect( _ ).to.have.property( 'pickDeep' );
        expect( _.pickDeep ).to.be.a( 'function' );
        expect( _.pickDeep ).to.equal( pickDeep );
      });

      afterEach(function() {
        // Assert post-condition
        expect( _ ).to.have.property( 'pickDeep' );
        expect( _.pickDeep ).to.be.a( 'function' );
        expect( _.pickDeep ).to.equal( pickDeep );
      });


      it( 'should return an empty object for non-object "object" argument values', function() {
        expect( _.pickDeep( null, [ 'a' ] ) ).to.deep.equal( {} );
      });

      it( 'should not alter the original object', function() {
        expect( deepObj ).to.deep.equal( clonedDeepObj );
        expect( _.pickDeep( deepObj, [ 'a.b.c' ] ) ).to.deep.equal( abcPickedObj );
        expect( deepObj ).to.deep.equal( clonedDeepObj );
      });

      it( 'should allow for no "props" argument', function() {
        expect( _.pickDeep( deepObj ) ).to.deep.equal( {} );
      });

      it( 'should allow for a single string "props" argument', function() {
        expect( _.pickDeep( deepObj, 'a.b.c' ) ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for multiple string "props..." arguments', function() {
        expect( _.pickDeep( deepObj, 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a single array "props" argument containing a single item', function() {
        expect( _.pickDeep( deepObj, [ 'a.b.c' ] ) ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for a single array "props" argument containing multiple items', function() {
        expect( _.pickDeep( deepObj, [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing a single item', function() {
        expect( _.pickDeep( deepObj, [ 'a.b.c' ], [ 'a.b.d' ], [ 'a.b.e' ], [ 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing multiple items', function() {
        expect( _.pickDeep( deepObj, [ 'a.b.c', 'a.b.d' ], [ 'a.b.e', 'a.m' ] ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a combination of string and array "props..." arguments', function() {
        expect( _.pickDeep( deepObj, 'a.b.c', [ 'a.b.d', 'a.b.e' ], 'a.m' ) ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should gracefully ignored unmatched paths in the "props" argument', function() {
        expect( _.pickDeep( deepObj, [ 'x.y.z' ] ) ).to.deep.equal( {} );
        expect( _.pickDeep( deepObj, [ 'a.b.c', 'x.y.z' ] ) ).to.deep.equal( abcPickedObj );
        expect( _.pickDeep( deepObj, [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m', 'x.y.z', 'a.q.u.a' ] ) ).to.deep.equal( abcdemPickedObj );
      });

    });


    describe( '_.chain(...).pickDeep', function() {
      var _chainedObj = _.chain( deepObj );

      beforeEach(function() {
        // Assert pre-conditions
        expect( _chainedObj ).to.have.property( 'pickDeep' );
        expect( _chainedObj.pickDeep ).to.be.a( 'function' );
        expect( _chainedObj.pickDeep ).to.not.equal( pickDeep );
      });

      afterEach(function() {
        // Assert post-conditions
        expect( _chainedObj ).to.have.property( 'pickDeep' );
        expect( _chainedObj.pickDeep ).to.be.a( 'function' );
        expect( _chainedObj.pickDeep ).to.not.equal( pickDeep );
      });


      it( 'should return an empty object for non-object "object" argument values', function() {
        expect( _.chain( null ).pickDeep( [ 'a' ] ).value() ).to.deep.equal( {} );
      });

      it( 'should not alter the original object', function() {
        expect( deepObj ).to.deep.equal( clonedDeepObj );
        expect( _chainedObj.value() ).to.deep.equal( clonedDeepObj );
        expect( _chainedObj.pickDeep( [ 'a.b.c' ] ).value() ).to.deep.equal( abcPickedObj );
        expect( _chainedObj.value() ).to.deep.equal( clonedDeepObj );
        expect( deepObj ).to.deep.equal( clonedDeepObj );
      });

      it( 'should allow for no "props" argument', function() {
        expect( _chainedObj.pickDeep().value() ).to.deep.equal( {} );
      });

      it( 'should allow for a single string "props" argument', function() {
        expect( _chainedObj.pickDeep( 'a.b.c' ).value() ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for multiple string "props..." arguments', function() {
        expect( _chainedObj.pickDeep( 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ).value() ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a single array "props" argument containing a single item', function() {
        expect( _chainedObj.pickDeep( [ 'a.b.c' ] ).value() ).to.deep.equal( abcPickedObj );
      });

      it( 'should allow for a single array "props" argument containing multiple items', function() {
        expect( _chainedObj.pickDeep( [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m' ] ).value() ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing a single item', function() {
        expect( _chainedObj.pickDeep( [ 'a.b.c' ], [ 'a.b.d' ], [ 'a.b.e' ], [ 'a.m' ] ).value() ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for multiple array "props..." arguments, each containing multiple items', function() {
        expect( _chainedObj.pickDeep( [ 'a.b.c', 'a.b.d' ], [ 'a.b.e', 'a.m' ] ).value() ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should allow for a combination of string and array "props..." arguments', function() {
        expect( _chainedObj.pickDeep( 'a.b.c', [ 'a.b.d', 'a.b.e' ], 'a.m' ).value() ).to.deep.equal( abcdemPickedObj );
      });

      it( 'should gracefully ignored unmatched paths in the "props" argument', function() {
        expect( _chainedObj.pickDeep( [ 'x.y.z' ] ).value() ).to.deep.equal( {} );
        expect( _chainedObj.pickDeep( [ 'a.b.c', 'x.y.z' ] ).value() ).to.deep.equal( abcPickedObj );
        expect( _chainedObj.pickDeep( [ 'a.b.c', 'a.b.d', 'a.b.e', 'a.m', 'x.y.z', 'a.q.u.a' ] ).value() ).to.deep.equal( abcdemPickedObj );
      });

    });

  });

});

