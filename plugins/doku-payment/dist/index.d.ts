import * as _$openclaw_plugin_sdk_core0 from "openclaw/plugin-sdk/core";

//#region node_modules/typebox/build/type/types/schema.d.mts
interface TSchema {}
interface TSchemaOptions {
  /**
   * Allows for additional, unlisted properties to be included, typically for extensibility.
   */
  [key: PropertyKey]: unknown;
  /**
   * Specifies the URI of a JSON Schema that the current schema adheres to.
   */
  $schema?: string;
  /**
   * A URI that serves as a unique identifier for the schema.
   */
  $id?: string;
  /**
   * A short explanation about the purpose of the data described by the schema.
   */
  title?: string;
  /**
   * A detailed explanation of the data described by the schema.
   */
  description?: string;
  /**
   * A default value for the data, used when no value is provided.
   */
  default?: unknown;
  /**
   * Provides one or more examples of valid data conforming to the schema.
   */
  examples?: unknown;
  /**
   * Indicates that the data should only be readable and not modified.
   */
  readOnly?: boolean;
  /**
   * Indicates that the data should only be writable and not read back.
   */
  writeOnly?: boolean;
  /**
   * A schema to apply conditionally: if the data validates against this schema, 'then' applies.
   */
  if?: TSchema;
  /**
   * A schema to apply if the data validates against the 'if' schema.
   */
  then?: TSchema;
  /**
   * A schema to apply if the data does not validate against the 'if' schema.
   */
  else?: TSchema;
}
interface TObjectOptions extends TSchemaOptions {
  /**
   * Defines whether additional properties are allowed beyond those explicitly defined in `properties`.
   */
  additionalProperties?: TSchema | boolean;
  /**
   * The minimum number of properties required in the object.
   */
  minProperties?: number;
  /**
   * The maximum number of properties allowed in the object.
   */
  maxProperties?: number;
  /**
   * Defines conditional requirements for properties.
   */
  dependencies?: Record<string, boolean | TSchema | string[]>;
  /**
   * Specifies properties that *must* be present if a given property is present.
   */
  dependentRequired?: Record<string, string[]>;
  /**
   * Defines schemas that apply if a specific property is present.
   */
  dependentSchemas?: Record<string, TSchema>;
  /**
   * Maps regular expressions to schemas properties matching a pattern must validate against the schema.
   */
  patternProperties?: Record<string, TSchema>;
  /**
   * A schema that all property names within the object must validate against.
   */
  propertyNames?: TSchema;
}
//#endregion
//#region node_modules/typebox/build/type/action/_optional.d.mts
/** Represents a operation to apply Optional to a property */
interface TOptionalAddAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'OptionalAddAction';
  type: Type;
}
/** Represents a operation to remove Optional from a property */
interface TOptionalRemoveAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'OptionalRemoveAction';
  type: Type;
}
//#endregion
//#region node_modules/typebox/build/type/action/_readonly.d.mts
/** Represents an operation to apply Readonly to a property. */
interface TReadonlyAddAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'ReadonlyAddAction';
  type: Type;
}
/** Represents an action to remove Readonly from a property. */
interface TReadonlyRemoveAction<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'ReadonlyRemoveAction';
  type: Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/deferred.d.mts
/** Represents a deferred action. */
interface TDeferred<Action extends string = string, Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Deferred';
  action: Action;
  parameters: Types;
  options: TSchemaOptions;
}
//#endregion
//#region node_modules/typebox/build/type/types/_codec.d.mts
type StaticCodec<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Decoded extends unknown> = (Direction extends 'Decode' ? Decoded : StaticType<Stack, Direction, Context, This, Omit<Type, '~codec'>>);
type TDecodeCallback<Type extends TSchema, Decoded = unknown> = (input: StaticType<[], 'Decode', {}, {}, Type>) => Decoded;
type TEncodeCallback<Type extends TSchema, Decoded = unknown> = (input: Decoded) => StaticType<[], 'Decode', {}, {}, Type>;
type TCodec<Type extends TSchema = TSchema, Decoded extends unknown = unknown> = Type & {
  '~codec': {
    encode: TDecodeCallback<Type, Decoded>;
    decode: TEncodeCallback<Type, Decoded>;
  };
};
//#endregion
//#region node_modules/typebox/build/type/types/any.d.mts
type StaticAny = any;
/** Represents a Any type. */
interface TAny extends TSchema {
  '~kind': 'Any';
}
//#endregion
//#region node_modules/typebox/build/type/types/_immutable.d.mts
/** Adds Immutable to the given type. */
type TImmutableAdd<Type extends TSchema = TSchema> = ('~immutable' extends keyof Type ? Type : TImmutable<Type>);
type TImmutable<Type extends TSchema = TSchema> = (Type & {
  '~immutable': true;
});
//#endregion
//#region node_modules/typebox/build/type/types/array.d.mts
type StaticArray<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Array extends TSchema, Item extends TSchema, Result extends readonly unknown[] = (Array extends TImmutable ? readonly StaticType<Stack, Direction, Context, This, Item>[] : StaticType<Stack, Direction, Context, This, Item>[])> = Result;
/** Represents an Array type. */
interface TArray<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Array';
  type: 'array';
  items: Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/async_iterator.d.mts
type StaticAsyncIterator<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Result = AsyncIterableIterator<StaticType<Stack, Direction, Context, This, Type>>> = Result;
/** Represents a AsyncIterator. */
interface TAsyncIterator<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'AsyncIterator';
  type: 'asyncIterator';
  iteratorItems: Type;
}
//#endregion
//#region node_modules/typebox/build/schema/types/schema.d.mts
type XSchemaObject = object;
type XSchemaBoolean = boolean;
type XSchema = XSchemaObject | XSchemaBoolean;
//#endregion
//#region node_modules/typebox/build/schema/types/_guard.d.mts
interface XGuardInterface<Value extends unknown = unknown> {
  check(value: unknown): value is Value;
  errors(value: unknown): object[];
}
interface XGuard<Value extends unknown = unknown> {
  '~guard': XGuardInterface<Value>;
}
//#endregion
//#region node_modules/typebox/build/schema/types/additionalItems.d.mts
interface XAdditionalItems<AdditionalItems extends XSchema = XSchema> {
  additionalItems: AdditionalItems;
}
//#endregion
//#region node_modules/typebox/build/schema/types/additionalProperties.d.mts
interface XAdditionalProperties<AdditionalProperties extends XSchema = XSchema> {
  additionalProperties: AdditionalProperties;
}
//#endregion
//#region node_modules/typebox/build/schema/types/allOf.d.mts
interface XAllOf<AllOf extends XSchema[] = XSchema[]> {
  allOf: AllOf;
}
//#endregion
//#region node_modules/typebox/build/schema/types/anyOf.d.mts
interface XAnyOf<AnyOf extends XSchema[] = XSchema[]> {
  anyOf: AnyOf;
}
//#endregion
//#region node_modules/typebox/build/schema/types/const.d.mts
interface XConst<Const extends unknown = unknown> {
  const: Const;
}
//#endregion
//#region node_modules/typebox/build/schema/types/else.d.mts
interface XElse<Else extends XSchema = XSchema> {
  else: Else;
}
//#endregion
//#region node_modules/typebox/build/schema/types/enum.d.mts
interface XEnum<Enum extends unknown[] = unknown[]> {
  enum: Enum;
}
//#endregion
//#region node_modules/typebox/build/schema/types/if.d.mts
interface XIf<If extends XSchema = XSchema> {
  if: If;
}
//#endregion
//#region node_modules/typebox/build/schema/types/items.d.mts
interface XItems<Items extends (XSchema | XSchema[]) = (XSchema | XSchema[])> {
  items: Items;
}
//#endregion
//#region node_modules/typebox/build/schema/types/maxItems.d.mts
interface XMaxItems<MaxItems extends number = number> {
  maxItems: MaxItems;
}
//#endregion
//#region node_modules/typebox/build/schema/types/minItems.d.mts
interface XMinItems<MinItems extends number = number> {
  minItems: MinItems;
}
//#endregion
//#region node_modules/typebox/build/schema/types/oneOf.d.mts
interface XOneOf<OneOf extends XSchema[] = XSchema[]> {
  oneOf: OneOf;
}
//#endregion
//#region node_modules/typebox/build/schema/types/patternProperties.d.mts
interface XPatternProperties<PatternProperties extends Record<PropertyKey, XSchema> = Record<PropertyKey, XSchema>> {
  patternProperties: PatternProperties;
}
//#endregion
//#region node_modules/typebox/build/schema/types/prefixItems.d.mts
interface XPrefixItems<PrefixItems extends XSchema[] = XSchema[]> {
  prefixItems: PrefixItems;
}
//#endregion
//#region node_modules/typebox/build/schema/types/properties.d.mts
interface XProperties<Properties extends Record<PropertyKey, XSchema> = Record<PropertyKey, XSchema>> {
  properties: Properties;
}
//#endregion
//#region node_modules/typebox/build/schema/types/ref.d.mts
interface XRef<Ref extends string = string> {
  $ref: Ref;
}
//#endregion
//#region node_modules/typebox/build/schema/types/required.d.mts
interface XRequired<Required extends string[] = string[]> {
  required: Required;
}
//#endregion
//#region node_modules/typebox/build/schema/types/then.d.mts
interface XThen<Then extends XSchema = XSchema> {
  then: Then;
}
//#endregion
//#region node_modules/typebox/build/schema/types/type.d.mts
interface XType<Type extends string | string[] = string | string[]> {
  type: Type;
}
//#endregion
//#region node_modules/typebox/build/schema/types/unevaluatedProperties.d.mts
interface XUnevaluatedProperties<UnevaluatedProperties extends XSchema = XSchema> {
  unevaluatedProperties: UnevaluatedProperties;
}
//#endregion
//#region node_modules/typebox/build/type/types/base.d.mts
type StaticBase<Value extends unknown> = Value;
/**
 * @deprecated Use Type.Refine() + Type.Unsafe() instead.
 *
 *
 * **Reason:** It is noted that JavaScript class instances do not behave like
 * plain objects during structural clone or when the TB compositor needs to
 * assign dynamic modifier properties (such as '~optional').
 *
 * Because the TypeBox compositor needs to transform schematics via object clone /
 * property spread, these operations can result in class instance types losing
 * methods on the prototype (via clone), which can lead to unexpected structures being
 * returned. This has led to special-case (non-clone) handling for Base which needs
 * to be removed as it has proven orthogonal to the TypeBox 1.x design.
 *
 * The Base type was introduced in 1.x to try integrate / embed Standard Schema into JSON
 * Schema; however, support for integrated Standard Schema embedding will not be continued
 * in TypeBox. This type will be removed in the next minor revision of TypeBox.
 *
 * ```typescript
 * // (Deprecated)
 * class DateType extends Type.Base<Date> { Check(value) { return value instanceof Date } }
 *
 * // (Future)
 * const DateType = Type.Refine(Type.Unsafe<Date>({}), value => value instanceof Date)
 * ```
 */
declare class Base<Value extends unknown = unknown> implements TSchema, XGuard<Value> {
  readonly '~kind': 'Base';
  readonly '~guard': XGuardInterface<Value>;
  constructor();
  /** Checks a value or returns false if invalid */
  Check(_value: unknown): _value is Value;
  /** Returns errors for a value. Return an empty array if valid.  */
  Errors(_value: unknown): object[];
  /** Converts a value into this type */
  Convert(value: unknown): unknown;
  /** Cleans a value according to this type */
  Clean(value: unknown): unknown;
  /** Returns a default value for this type */
  Default(value: unknown): unknown;
  /** Creates a new instance of this type */
  Create(): Value;
  /** Clones this type  */
  Clone(): Base;
}
//#endregion
//#region node_modules/typebox/build/type/types/bigint.d.mts
declare const BigIntPattern = "-?(?:0|[1-9][0-9]*)n";
type StaticBigInt = bigint;
/** Represents a BigInt type. */
interface TBigInt extends TSchema {
  '~kind': 'BigInt';
  type: 'bigint';
}
//#endregion
//#region node_modules/typebox/build/type/types/boolean.d.mts
type StaticBoolean = boolean;
/** Represents a Boolean type. */
interface TBoolean extends TSchema {
  '~kind': 'Boolean';
  type: 'boolean';
}
//#endregion
//#region node_modules/typebox/build/type/types/_optional.d.mts
/** Removes Optional from the given type. */
type TOptionalRemove<Type extends TSchema, Result extends TSchema = (Type extends TOptional<infer Type extends TSchema> ? Type : Type)> = Result;
/** Adds Optional to the given type. */
type TOptionalAdd<Type extends TSchema = TSchema, Result extends TSchema = ('~optional' extends keyof Type ? Type : TOptional<Type>)> = Result;
type TOptional<Type extends TSchema = TSchema> = (Type & {
  '~optional': true;
});
//#endregion
//#region node_modules/typebox/build/type/types/_readonly.d.mts
/** Removes a Readonly property modifier from the given type. */
type TReadonlyRemove<Type extends TSchema, Result extends TSchema = (Type extends TReadonly<infer Type extends TSchema> ? Type : Type)> = Result;
/** Adds a Readonly property modifier to the given type. */
type TReadonlyAdd<Type extends TSchema = TSchema> = ('~readonly' extends keyof Type ? Type : TReadonly<Type>);
type TReadonly<Type extends TSchema = TSchema> = (Type & {
  '~readonly': true;
});
//#endregion
//#region node_modules/typebox/build/type/types/rest.d.mts
/** Represents a Rest instruction. */
interface TRest<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Rest';
  type: 'rest';
  items: Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/tuple.d.mts
type StaticLast<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Result extends unknown[]> = (Type extends TRest<infer RestType extends TSchema> ? RestType extends TArray<infer ArrayType extends TSchema> ? [...Result, ...TStaticElement<Stack, Direction, Context, This, ArrayType>[0][]] : [...Result, never] : [...Result, ...TStaticElement<Stack, Direction, Context, This, Type>]);
type TStaticElement<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, IsReadonly extends boolean = (Type extends TReadonly ? true : false), IsOptional extends boolean = (Type extends TOptional ? true : false), Inferred extends unknown = StaticType<Stack, Direction, Context, This, Type>, Result extends [unknown?] = ([IsReadonly, IsOptional] extends [true, true] ? [Readonly<Inferred>?] : [IsReadonly, IsOptional] extends [false, true] ? [Inferred?] : [IsReadonly, IsOptional] extends [true, false] ? [Readonly<Inferred>] : [Inferred])> = Result;
type TStaticElements<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown[] = []> = (Types extends [infer Last extends TSchema] ? StaticLast<Stack, Direction, Context, This, Last, Result> : Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TStaticElements<Stack, Direction, Context, This, Right, [...Result, ...TStaticElement<Stack, Direction, Context, This, Left>]> : Result);
type StaticTuple<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Tuple extends TSchema, Items extends TSchema[], Elements extends unknown[] = TStaticElements<Stack, Direction, Context, This, Items>, Result extends readonly unknown[] = (Tuple extends TImmutable ? readonly [...Elements] : Elements)> = Result;
/** Represents a Tuple type. */
interface TTuple<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Tuple';
  type: 'array';
  additionalItems: false;
  items: Types;
  minItems: Types['length'];
}
//#endregion
//#region node_modules/typebox/build/type/types/unknown.d.mts
type StaticUnknown = unknown;
/** Represents an Unknown type. */
interface TUnknown extends TSchema {
  '~kind': 'Unknown';
}
//#endregion
//#region node_modules/typebox/build/type/types/parameter.d.mts
/** Represents a Generic parameter. */
interface TParameter<Name extends string = string, Extends extends TSchema = TSchema, Equals extends TSchema = TSchema> extends TSchema {
  '~kind': 'Parameter';
  name: Name;
  extends: Extends;
  equals: Equals;
}
//#endregion
//#region node_modules/typebox/build/type/types/object.d.mts
type StaticObject<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, _This extends TProperties, Properties extends TProperties, Result = (keyof Properties extends never ? object : StaticProperties<Stack, Direction, Context, Properties, Properties>)> = Result;
/** Represents an Object type. */
interface TObject<Properties extends TProperties = TProperties> extends TSchema {
  '~kind': 'Object';
  type: 'object';
  properties: Properties;
  required: TRequiredArray<Properties>;
}
//#endregion
//#region node_modules/typebox/build/type/types/ref.d.mts
type CyclicStackLength<Stack extends unknown[], MaxLength extends number, Buffer extends unknown[] = []> = (Stack extends [infer Left, ...infer Right] ? Buffer['length'] extends MaxLength ? false : CyclicStackLength<Right, MaxLength, [...Buffer, Left]> : true);
type CyclicGuard<Stack extends unknown[], Ref extends string> = (Ref extends Stack[number] ? CyclicStackLength<Stack, 2> : true);
type StaticGuardedRef<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Ref extends string, Type extends TSchema> = (CyclicGuard<Stack, Ref> extends true ? StaticType<[...Stack, Ref], Direction, Context, This, Type> : any);
type StaticRef<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Ref extends string, Target extends TSchema = (Ref extends keyof Context ? Context[Ref] : TUnknown), Result extends unknown = (Target extends TObject ? StaticType<[], Direction, Context, This, Target> : StaticGuardedRef<Stack, Direction, Context, This, Ref, Target>)> = Result;
/** Represents a type reference. */
interface TRef<Ref extends string = string> extends TSchema {
  '~kind': 'Ref';
  $ref: Ref;
}
//#endregion
//#region node_modules/typebox/build/type/types/generic.d.mts
/** Represents a callable Generic type. */
interface TGeneric<Parameters extends TParameter[] = TParameter[], Expression extends TSchema = TSchema> extends TSchema {
  '~kind': 'Generic';
  type: 'generic';
  parameters: Parameters;
  expression: Expression;
}
//#endregion
//#region node_modules/typebox/build/type/types/never.d.mts
declare const NeverPattern = "(?!)";
type StaticNever = never;
/** Represents a Never type. */
interface TNever extends TSchema {
  '~kind': 'Never';
  not: {};
}
//#endregion
//#region node_modules/typebox/build/type/types/union.d.mts
type StaticUnion<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown = never> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? StaticUnion<Stack, Direction, Context, This, Right, Result | StaticType<Stack, Direction, Context, This, Left>> : Result);
/** Represents a logical Union type. */
interface TUnion<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Union';
  anyOf: Types;
}
//#endregion
//#region node_modules/typebox/build/type/types/cyclic.d.mts
type StaticCyclic<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Defs extends TProperties, Ref extends string, Result extends unknown = (Ref extends keyof Defs ? StaticType<[...Stack, Ref], Direction, Defs, This, Defs[Ref]> : never)> = Result;
/** Represents a Cyclic type. */
interface TCyclic<Defs extends TProperties = TProperties, Ref extends string = string> extends TSchema {
  '~kind': 'Cyclic';
  $defs: Defs;
  $ref: Ref;
}
//#endregion
//#region node_modules/typebox/build/type/engine/helpers/union.d.mts
type TUnionToIntersect<U> = (U extends unknown ? (arg: U) => 0 : never) extends ((arg: infer I) => 0) ? I : never;
type TUnionLast<U> = TUnionToIntersect<U extends unknown ? (x: U) => 0 : never> extends ((x: infer L) => 0) ? L : never;
type TUnionToTuple<U, Result extends unknown[] = [], R = TUnionLast<U>> = [U] extends [never] ? Result : TUnionToTuple<Exclude<U, R>, [Extract<U, R>, ...Result]>;
//#endregion
//#region node_modules/typebox/build/type/types/enum.d.mts
type StaticEnum<Values extends TEnumValue[]> = (Values[number]);
type TEnumValue = string | number | null;
/** Represents an Enum type. */
interface TEnum<Values extends TEnumValue[] = TEnumValue[]> extends TSchema {
  '~kind': 'Enum';
  enum: Values;
}
//#endregion
//#region node_modules/typebox/build/type/types/identifier.d.mts
/** Represents a Identifier. */
interface TIdentifier<Name extends string = string> extends TSchema {
  '~kind': 'Identifier';
  type: 'identifier';
  name: Name;
}
//#endregion
//#region node_modules/typebox/build/type/types/infer.d.mts
/** Represents an Infer instruction. */
interface TInfer<Name extends string = string, Extends extends TSchema = TSchema> extends TSchema {
  '~kind': 'Infer';
  type: 'infer';
  name: Name;
  extends: Extends;
}
//#endregion
//#region node_modules/typebox/build/type/types/integer.d.mts
declare const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
type StaticInteger = number;
/** Represents an integer type. */
interface TInteger extends TSchema {
  '~kind': 'Integer';
  type: 'integer';
}
//#endregion
//#region node_modules/typebox/build/type/types/intersect.d.mts
type StaticIntersect<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown = unknown> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? StaticIntersect<Stack, Direction, Context, This, Right, Result & StaticType<Stack, Direction, Context, This, Left>> : Result);
/** Represents a logical Intersect type. */
interface TIntersect<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Intersect';
  allOf: Types;
}
//#endregion
//#region node_modules/typebox/build/type/types/iterator.d.mts
type StaticIterator<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Result = IterableIterator<StaticType<Stack, Direction, Context, This, Type>>> = Result;
/** Represents an Iterator. */
interface TIterator<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Iterator';
  type: 'iterator';
  iteratorItems: Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/literal.d.mts
type StaticLiteral<Value extends TLiteralValue> = (Value);
type TLiteralTypeName<Value extends TLiteralValue> = (Value extends bigint ? 'bigint' : Value extends boolean ? 'boolean' : Value extends number ? 'number' : Value extends string ? 'string' : never);
type TLiteralValue = string | number | boolean | bigint;
/** Represents a Literal type. */
interface TLiteral<Value extends TLiteralValue = TLiteralValue> extends TSchema {
  '~kind': 'Literal';
  type: TLiteralTypeName<Value>;
  const: Value;
}
//#endregion
//#region node_modules/typebox/build/type/types/null.d.mts
type StaticNull = null;
/** Represents a Null type. */
interface TNull extends TSchema {
  '~kind': 'Null';
  type: 'null';
}
//#endregion
//#region node_modules/typebox/build/type/types/number.d.mts
declare const NumberPattern = "-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?";
type StaticNumber = number;
/** Represents a Number type. */
interface TNumber extends TSchema {
  '~kind': 'Number';
  type: 'number';
}
//#endregion
//#region node_modules/typebox/build/type/types/symbol.d.mts
type StaticSymbol = symbol;
/** Represents a Symbol type. */
interface TSymbol extends TSchema {
  '~kind': 'Symbol';
  type: 'symbol';
}
//#endregion
//#region node_modules/typebox/build/type/types/promise.d.mts
type StaticPromise<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, Result = Promise<StaticType<Stack, Direction, Context, This, Type>>> = Result;
/** Represents a Promise type. */
interface TPromise<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Promise';
  type: 'promise';
  item: Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/string.d.mts
declare const StringPattern = ".*";
type StaticString = string;
/** Represents a String type. */
interface TString extends TSchema {
  '~kind': 'String';
  type: 'string';
}
//#endregion
//#region node_modules/typebox/build/system/unreachable/unreachable.d.mts
type TUnreachable = never;
//#endregion
//#region node_modules/typebox/build/system/memory/assign.d.mts
type ObjectLike = Record<PropertyKey, any>;
/**
 * Performs an Object assign using the Left and Right object types. We track this operation as it
 * creates a new GC handle per assignment.
 */
type TAssign<Left extends ObjectLike, Right extends ObjectLike, Assigned extends ObjectLike = Omit<Left, keyof Right> & Right> = { [Key in keyof Assigned]: Assigned[Key] } & {};
//#endregion
//#region node_modules/typebox/build/type/script/mapping.d.mts
type TPatternBigIntMapping<Input extends '-?(?:0|[1-9][0-9]*)n'> = (TBigInt);
type TPatternStringMapping<Input extends '.*'> = (TString);
type TPatternNumberMapping<Input extends '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?'> = (TNumber);
type TPatternIntegerMapping<Input extends '-?(?:0|[1-9][0-9]*)'> = (TInteger);
type TPatternNeverMapping<Input extends '(?!)'> = (TNever);
type TPatternTextMapping<Input extends string, Result extends TSchema = TLiteral<Input>> = Result;
type TPatternBaseMapping<Input extends unknown> = (Input);
type TPatternGroupMapping<Input extends [unknown, unknown, unknown]> = (Input extends ['(', infer Body extends TSchema[], ')'] ? TUnion<Body> : never);
type TPatternUnionMapping<Input extends [unknown, unknown, unknown] | [unknown] | []> = (Input extends [infer Term extends TSchema[], '|', infer Union extends TSchema[]] ? [...Term, ...Union] : Input extends [infer Term extends TSchema[]] ? [...Term] : []);
type TPatternTermMapping<Input extends [unknown, unknown]> = (Input extends [infer Left extends TSchema, infer Right extends TSchema[]] ? [Left, ...Right] : never);
type TPatternBodyMapping<Input extends unknown> = (Input);
type TPatternMapping<Input extends [unknown, unknown, unknown]> = (Input extends ['^', infer Body extends TSchema[], '$'] ? Body : never);
//#endregion
//#region node_modules/typebox/build/type/script/token/internal/take.d.mts
type TTakeVariant<Variant extends string, Input extends string> = (Input extends `${Variant}${infer Rest extends string}` ? [Variant, Rest] : []);
/** Takes one of the given variants or fail */
type TTake<Variants extends string[], Input extends string> = (Variants extends [infer ValueLeft extends string, ...infer ValueRight extends string[]] ? TTakeVariant<ValueLeft, Input> extends [infer Take extends string, infer Rest extends string] ? [Take, Rest] : TTake<ValueRight, Input> : []);
/** Takes one of the given variants or fail */
declare function Take<Variants extends string[], Input extends string>(variants: [...Variants], input: Input): TTake<Variants, Input>;
//#endregion
//#region node_modules/typebox/build/type/script/token/internal/char.d.mts
declare const WhiteSpace = " ";
declare const NewLine = "\n";
declare const TabSpace = "\t";
type TWhiteSpace = typeof WhiteSpace;
type TNewLine = typeof NewLine;
type TTabSpace = typeof TabSpace;
//#endregion
//#region node_modules/typebox/build/type/script/token/internal/trim.d.mts
type LineComment = typeof LineComment;
type OpenComment = typeof OpenComment;
type CloseComment = typeof CloseComment;
declare const LineComment = "//";
declare const OpenComment = "/*";
declare const CloseComment = "*/";
type TDiscardMultiLineComment<Input extends string> = (Input extends `${string}${CloseComment}${infer Rest extends string}` ? Rest : '');
type TDiscardLineComment<Input extends string> = (Input extends `${string}${TNewLine}${infer Rest extends string}` ? TTrimWhitespace<`${TNewLine}${Rest}`> : '');
type W4 = `${W3}${W3}`;
type W3 = `${W2}${W2}`;
type W2 = `${W1}${W1}`;
type W1 = `${W0}${W0}`;
type W0 = ` `;
type TTrimWhitespace<Input extends string> = (Input extends `${OpenComment}${infer Rest extends string}` ? TTrimWhitespace<TDiscardMultiLineComment<Rest>> : Input extends `${LineComment}${infer Rest extends string}` ? TTrimWhitespace<TDiscardLineComment<Rest>> : Input extends `${W4}${infer Rest extends string}` ? TTrimWhitespace<Rest> : Input extends `${W3}${infer Rest extends string}` ? TTrimWhitespace<Rest> : Input extends `${W1}${infer Rest extends string}` ? TTrimWhitespace<Rest> : Input extends `${W0}${infer Rest extends string}` ? TTrimWhitespace<Rest> : Input);
type TTrim<Input extends string> = (Input extends `${OpenComment}${infer Rest extends string}` ? TTrim<TDiscardMultiLineComment<Rest>> : Input extends `${LineComment}${infer Rest extends string}` ? TTrim<TDiscardLineComment<Rest>> : Input extends `${TNewLine}${infer Rest extends string}` ? TTrim<Rest> : Input extends `${TTabSpace}${infer Rest extends string}` ? TTrim<Rest> : Input extends `${W4}${infer Rest extends string}` ? TTrim<Rest> : Input extends `${W3}${infer Rest extends string}` ? TTrim<Rest> : Input extends `${W1}${infer Rest extends string}` ? TTrim<Rest> : Input extends `${W0}${infer Rest extends string}` ? TTrim<Rest> : Input);
//#endregion
//#region node_modules/typebox/build/type/script/token/const.d.mts
type TTakeConst<Const extends string, Input extends string> = (TTake<[Const], Input>);
/** Matches if next is the given Const value */
type TConst<Const extends string, Input extends string> = (Const extends '' ? ['', Input] : Const extends `${infer First extends string}${string}` ? (First extends TNewLine ? TTakeConst<Const, TTrimWhitespace<Input>> : First extends TWhiteSpace ? TTakeConst<Const, Input> : TTakeConst<Const, TTrim<Input>>) : never);
//#endregion
//#region node_modules/typebox/build/type/script/token/until.d.mts
type TTakeOne<Input extends string> = (Input extends `${infer Left extends string}${infer Right extends string}` ? [Left, Right] : []);
type TIsInputMatchSentinal<End extends string[], Input extends string> = (End extends [infer Left extends string, ...infer Right extends string[]] ? Input extends `${Left}${string}` ? true : TIsInputMatchSentinal<Right, Input> : false);
/** Match Input until but not including End. No match if End not found. */
type TUntil<End extends string[], Input extends string, Result extends string = ''> = (TTakeOne<Input> extends [infer One extends string, infer Rest extends string] ? TIsInputMatchSentinal<End, Input> extends true ? [Result, Input] : TUntil<End, Rest, `${Result}${One}`> : []);
//#endregion
//#region node_modules/typebox/build/type/script/token/until_1.d.mts
/** Match Input until but not including End. No match if End not found or match is zero-length. */
type TUntil_1<End extends string[], Input extends string> = (TUntil<End, Input> extends [infer Until extends string, infer UntilRest extends string] ? Until extends '' ? [] : [Until, UntilRest] : []);
//#endregion
//#region node_modules/typebox/build/type/script/parser.d.mts
type TPatternBigInt<Input extends string> = TConst<'-?(?:0|[1-9][0-9]*)n', Input> extends [infer _0 extends '-?(?:0|[1-9][0-9]*)n', infer Input extends string] ? [TPatternBigIntMapping<_0>, Input] : [];
type TPatternString<Input extends string> = TConst<'.*', Input> extends [infer _0 extends '.*', infer Input extends string] ? [TPatternStringMapping<_0>, Input] : [];
type TPatternNumber<Input extends string> = TConst<'-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?', Input> extends [infer _0 extends '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?', infer Input extends string] ? [TPatternNumberMapping<_0>, Input] : [];
type TPatternInteger<Input extends string> = TConst<'-?(?:0|[1-9][0-9]*)', Input> extends [infer _0 extends '-?(?:0|[1-9][0-9]*)', infer Input extends string] ? [TPatternIntegerMapping<_0>, Input] : [];
type TPatternNever<Input extends string> = TConst<'(?!)', Input> extends [infer _0 extends '(?!)', infer Input extends string] ? [TPatternNeverMapping<_0>, Input] : [];
type TPatternText<Input extends string> = TUntil_1<['-?(?:0|[1-9][0-9]*)n', '.*', '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?', '-?(?:0|[1-9][0-9]*)', '(?!)', '(', ')', '$', '|'], Input> extends [infer _0 extends string, infer Input extends string] ? [TPatternTextMapping<_0>, Input] : [];
type TPatternBase<Input extends string> = (TPatternBigInt<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternString<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternNumber<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternInteger<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternNever<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternGroup<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternText<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : []) extends [infer _0 extends unknown, infer Input extends string] ? [TPatternBaseMapping<_0>, Input] : [];
type TPatternGroup<Input extends string> = (TConst<'(', Input> extends [infer _0, infer Input extends string] ? (TPatternBody<Input> extends [infer _1, infer Input extends string] ? (TConst<')', Input> extends [infer _2, infer Input extends string] ? [[_0, _1, _2], Input] : []) : []) : []) extends [infer _0 extends [unknown, unknown, unknown], infer Input extends string] ? [TPatternGroupMapping<_0>, Input] : [];
type TPatternUnion<Input extends string> = ((TPatternTerm<Input> extends [infer _0, infer Input extends string] ? (TConst<'|', Input> extends [infer _1, infer Input extends string] ? (TPatternUnion<Input> extends [infer _2, infer Input extends string] ? [[_0, _1, _2], Input] : []) : []) : []) extends [infer _0, infer Input extends string] ? [_0, Input] : (TPatternTerm<Input> extends [infer _0, infer Input extends string] ? [[_0], Input] : []) extends [infer _0, infer Input extends string] ? [_0, Input] : [[], Input] extends [infer _0, infer Input extends string] ? [_0, Input] : []) extends [infer _0 extends [unknown, unknown, unknown] | [unknown] | [], infer Input extends string] ? [TPatternUnionMapping<_0>, Input] : [];
type TPatternTerm<Input extends string> = (TPatternBase<Input> extends [infer _0, infer Input extends string] ? (TPatternBody<Input> extends [infer _1, infer Input extends string] ? [[_0, _1], Input] : []) : []) extends [infer _0 extends [unknown, unknown], infer Input extends string] ? [TPatternTermMapping<_0>, Input] : [];
type TPatternBody<Input extends string> = (TPatternUnion<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : TPatternTerm<Input> extends [infer _0, infer Input extends string] ? [_0, Input] : []) extends [infer _0 extends unknown, infer Input extends string] ? [TPatternBodyMapping<_0>, Input] : [];
type TPattern<Input extends string> = (TConst<'^', Input> extends [infer _0, infer Input extends string] ? (TPatternBody<Input> extends [infer _1, infer Input extends string] ? (TConst<'$', Input> extends [infer _2, infer Input extends string] ? [[_0, _1, _2], Input] : []) : []) : []) extends [infer _0 extends [unknown, unknown, unknown], infer Input extends string] ? [TPatternMapping<_0>, Input] : [];
//#endregion
//#region node_modules/typebox/build/type/engine/patterns/pattern.d.mts
/** Parses a Pattern into a sequence of TemplateLiteral types. A result of [] indicates failure to parse. */
type TParsePatternIntoTypes<Pattern extends string, Parsed extends [TSchema[], string] | [] = TPattern<Pattern>, Result extends TSchema[] = (Parsed extends [infer Types extends TSchema[], string] ? Types : [])> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/template_literal/static.d.mts
type TFromLiteral$5<Template extends string, Value extends TLiteralValue> = `${Template}${Value}`;
type TFromBigInt<Template extends string> = `${Template}${bigint}`;
type TFromString<Template extends string> = `${Template}${string}`;
type TFromNumber<Template extends string> = `${Template}${number}`;
type TFromInteger<Template extends string> = `${Template}${number}`;
type TFromUnion$8<Template extends string, Types extends TSchema[], Result extends string = never> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$8<Template, Right, Result | TFromType$18<'', Left>> : `${Template}${Result}`);
type TFromType$18<Template extends string, Type extends TSchema, Result extends string = (Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$8<Template, Types> : Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral$5<Template, Value> : Type extends TBigInt ? TFromBigInt<Template> : Type extends TString ? TFromString<Template> : Type extends TNumber ? TFromNumber<Template> : Type extends TInteger ? TFromInteger<Template> : never)> = Result;
type TFromSpan<Template extends string, Types extends TSchema[]> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromSpan<TFromType$18<Template, Left>, Right> : Template);
type TTemplateLiteralStatic<Pattern extends string, Types extends TSchema[] = TParsePatternIntoTypes<Pattern>> = TFromSpan<'', Types>;
//#endregion
//#region node_modules/typebox/build/type/engine/enum/enum_to_union.d.mts
type TFromEnumValue<Value extends TEnumValue, Result extends TSchema = (Value extends string | number ? TLiteral<Value> : Value extends null ? TNull : TNever)> = Result;
type TEnumValuesToVariants<Values extends TEnumValue[], Result extends TSchema[] = []> = (Values extends [infer Left extends TEnumValue, ...infer Right extends TEnumValue[]] ? TEnumValuesToVariants<Right, [...Result, TFromEnumValue<Left>]> : Result);
type TEnumValuesToUnion<Values extends TEnumValue[], Variants extends TSchema[] = TEnumValuesToVariants<Values>, Results extends TSchema = TUnion<Variants>> = Results;
type TEnumToUnion<Type extends TEnum, Result extends TSchema = TEnumValuesToUnion<Type['enum']>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/template_literal/encode.d.mts
type TJoinString<Input extends string[], Result extends string = ''> = (Input extends [infer Left extends string, ...infer Right extends string[]] ? Result extends '' ? TJoinString<Right, Left> : TJoinString<Right, `${Result}|${Left}`> : Result);
type TUnwrapTemplateLiteralPattern<Pattern extends string> = (Pattern extends `^${infer Pattern extends string}$` ? Pattern : never);
type TEncodeLiteral<Value extends TLiteralValue, Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${Value}`>);
type TEncodeBigInt<Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${typeof BigIntPattern}`>);
type TEncodeInteger<Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${typeof IntegerPattern}`>);
type TEncodeNumber<Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${typeof NumberPattern}`>);
type TEncodeBoolean<Right extends TSchema[], Pattern extends string> = (TEncodeType<TUnion<[TLiteral<'false'>, TLiteral<'true'>]>, Right, Pattern>);
type TEncodeString<Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${typeof StringPattern}`>);
type TEncodeTemplateLiteral<TemplatePattern extends string, Right extends TSchema[], Pattern extends string> = (TEncodeTypes<Right, `${Pattern}${TUnwrapTemplateLiteralPattern<TemplatePattern>}`>);
type TEncodeTemplateLiteralDeferred<Types extends TSchema[], Right extends TSchema[], Pattern extends string, TemplateLiteral extends TSchema = TTemplateLiteralAction<Types>, Result extends TSchema = TEncodeType<TemplateLiteral, Right, Pattern>> = Result;
type TEncodeEnum<Types extends TEnumValue[], Right extends TSchema[], Pattern extends string, Variants extends TSchema[] = TEnumValuesToVariants<Types>> = TEncodeUnion<Variants, Right, Pattern>;
type TEncodeUnion<Types extends TSchema[], Right extends TSchema[], Pattern extends string, Result extends string[] = []> = Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TEncodeUnion<Tail, Right, Pattern, [...Result, TEncodeType<Head, [], ''>]> : TEncodeTypes<Right, `${Pattern}(${TJoinString<Result>})`>;
type TEncodeType<Type extends TSchema, Right extends TSchema[], Pattern extends string> = (Type extends TEnum<infer Values extends TEnumValue[]> ? TEncodeEnum<Values, Right, Pattern> : Type extends TInteger ? TEncodeInteger<Right, Pattern> : Type extends TLiteral<infer Value extends TLiteralValue> ? TEncodeLiteral<Value, Right, Pattern> : Type extends TBigInt ? TEncodeBigInt<Right, Pattern> : Type extends TBoolean ? TEncodeBoolean<Right, Pattern> : Type extends TNumber ? TEncodeNumber<Right, Pattern> : Type extends TString ? TEncodeString<Right, Pattern> : Type extends TTemplateLiteral<infer TemplatePattern extends string> ? TEncodeTemplateLiteral<TemplatePattern, Right, Pattern> : Type extends TTemplateLiteralDeferred<infer Types extends TSchema[]> ? TEncodeTemplateLiteralDeferred<Types, Right, Pattern> : Type extends TUnion<infer Types extends TSchema[]> ? TEncodeUnion<Types, Right, Pattern> : typeof NeverPattern);
type TEncodeTypes<Types extends TSchema[], Pattern extends string> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TEncodeType<Left, Right, Pattern> : Pattern);
type TEncodePattern<Types extends TSchema[], Encoded extends string = TEncodeTypes<Types, ''>, Result extends string = `^${Encoded}$`> = Result;
/** Encodes a TemplateLiteral type sequence into a TemplateLiteral */
type TTemplateLiteralEncode<Types extends TSchema[], Pattern extends string = TEncodePattern<Types>, Result extends TSchema = TTemplateLiteral<Pattern>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/template_literal/instantiate.d.mts
type TTemplateLiteralAction<Types extends TSchema[], Result extends TSchema = (TCanInstantiate<Types> extends true ? TTemplateLiteralEncode<Types> : TTemplateLiteralDeferred<Types>)> = Result;
type TTemplateLiteralInstantiate<Context extends TProperties, State extends TState, Types extends TSchema[], InstantiatedTypes extends TSchema[] = TInstantiateTypes<Context, State, Types>> = TTemplateLiteralAction<InstantiatedTypes>;
//#endregion
//#region node_modules/typebox/build/type/types/template_literal.d.mts
type StaticTemplateLiteral<Pattern extends string> = (TTemplateLiteralStatic<Pattern>);
/** Represents a TemplateLiteral type. */
interface TTemplateLiteral<Pattern extends string = string> extends TSchema {
  '~kind': 'TemplateLiteral';
  type: 'string';
  pattern: Pattern;
}
/** Creates a deferred TemplateLiteral action. */
type TTemplateLiteralDeferred<Types extends TSchema[] = TSchema[]> = (TDeferred<'TemplateLiteral', [Types]>);
//#endregion
//#region node_modules/typebox/build/type/engine/template_literal/is_finite.d.mts
type TFromLiteral$4<_Value extends TLiteralValue> = true;
type TFromTypesReduce<Types extends TSchema[]> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromType$17<Left> extends true ? TFromTypesReduce<Right> : false : true);
type TFromTypes$4<Types extends TSchema[], Result extends boolean = (Types extends [] ? false : TFromTypesReduce<Types>)> = Result;
type TFromType$17<Type extends TSchema> = Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes$4<Types> : Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral$4<Value> : false;
/** Returns true if the given TemplateLiteral types yields a finite variant set */
type TIsTemplateLiteralFinite<Types extends TSchema[], Result extends boolean = TFromTypes$4<Types>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/template_literal/decode.d.mts
type TFromLiteralPush<Variants extends string[], Value extends TLiteralValue, Result extends string[] = []> = Variants extends [infer Left extends string, ...infer Right extends string[]] ? TFromLiteralPush<Right, Value, [...Result, `${Left}${Value}`]> : Result;
type TFromLiteral$3<Variants extends string[], Value extends TLiteralValue> = Variants extends [] ? [`${Value}`] : TFromLiteralPush<Variants, Value>;
type TFromUnion$7<Variants extends string[], Types extends TSchema[], Result extends string[] = []> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$7<Variants, Right, [...Result, ...TFromType$16<Variants, Left>]> : Result;
type TFromType$16<Variants extends string[], Type extends TSchema, Result extends string[] = (Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$7<Variants, Types> : Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral$3<Variants, Value> : TUnreachable)> = Result;
type TDecodeFromSpan<Variants extends string[], Types extends TSchema[]> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TDecodeFromSpan<TFromType$16<Variants, Left>, Right> : Variants;
type TVariantsToLiterals<Variants extends string[], Result extends TSchema[] = []> = Variants extends [infer Left extends string, ...infer Right extends string[]] ? TVariantsToLiterals<Right, [...Result, TLiteral<Left>]> : Result;
type TDecodeTypesAsUnion<Types extends TSchema[], Variants extends string[] = TDecodeFromSpan<[], Types>, Literals extends TSchema[] = TVariantsToLiterals<Variants>, Result extends TSchema = TUnion<Literals>> = Result;
type TDecodeTypes<Types extends TSchema[], Result extends TSchema = (Types extends [] ? TUnreachable : Types extends [infer Type extends TLiteral] ? Type : TDecodeTypesAsUnion<Types>)> = Result;
/** Decodes a TemplateLiteral into a Type. */
type TTemplateLiteralDecodeUnsafe<Pattern extends string, Types extends TSchema[] = TParsePatternIntoTypes<Pattern>, Result extends TSchema = (Types extends [] ? TString : TIsTemplateLiteralFinite<Types> extends true ? TDecodeTypes<Types> : TTemplateLiteral<Pattern>)> = Result;
/** Decodes a TemplateLiteral pattern but returns TString if the pattern in non-finite. */
type TTemplateLiteralDecode<Pattern extends string, Decoded extends TSchema = TTemplateLiteralDecodeUnsafe<Pattern>, Result extends TSchema = (Decoded extends TTemplateLiteral ? TString : Decoded)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_any.d.mts
type TFromAnyKey<Value extends TSchema, Result extends TSchema = TRecord<typeof StringKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_boolean.d.mts
type TFromBooleanKey<Value extends TSchema, Result extends TSchema = TObject<{
  true: Value;
  false: Value;
}>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_enum.d.mts
type TFromEnumKey<Values extends TEnumValue[], Value extends TSchema, UnionKey extends TSchema = TEnumValuesToUnion<Values>, Result extends TSchema = TFromKey<UnionKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_integer.d.mts
type TFromIntegerKey<_Key extends TInteger, Value extends TSchema, Result extends TSchema = TRecord<typeof IntegerKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/tuple/to_object.d.mts
type TTupleElementsToProperties<Types extends TSchema[], Result extends TProperties = {}> = (Types extends [...infer Left extends TSchema[], infer Right extends TSchema] ? TTupleElementsToProperties<Left, { [_ in Left['length']]: Right } & Result> : { [Key in keyof Result]: Result[Key] });
type TTupleToObject<Type extends TTuple, Properties extends TProperties = TTupleElementsToProperties<Type['items']>, Result extends TSchema = TObject<Properties>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/composite.d.mts
type TIsReadonlyProperty<Left extends TSchema, Right extends TSchema> = (Left extends TReadonly<Left> ? Right extends TReadonly<Right> ? true : false : false);
type TIsOptionalProperty<Left extends TSchema, Right extends TSchema> = (Left extends TOptional<Left> ? Right extends TOptional<Right> ? true : false : false);
type TCompositeProperty<Left extends TSchema, Right extends TSchema, IsReadonly extends boolean = TIsReadonlyProperty<Left, Right>, IsOptional extends boolean = TIsOptionalProperty<Left, Right>, Evaluated extends TSchema = TEvaluateIntersect<[Left, Right]>, Property extends TSchema = TReadonlyRemove<TOptionalRemove<Evaluated>>> = ([IsReadonly, IsOptional] extends [true, true] ? TReadonlyAdd<TOptionalAdd<Property>> : [IsReadonly, IsOptional] extends [true, false] ? TReadonlyAdd<Property> : [IsReadonly, IsOptional] extends [false, true] ? TOptionalAdd<Property> : Property);
type TCompositePropertyKey<Left extends TProperties, Right extends TProperties, Key extends PropertyKey, Result extends TSchema = (Key extends keyof Left ? Key extends keyof Right ? TCompositeProperty<Left[Key], Right[Key]> : Left[Key] : Key extends keyof Right ? Right[Key] : TNever)> = Result;
type TCompositeProperties<Left extends TProperties, Right extends TProperties, Result extends TProperties = { [Key in keyof (Right & Left)]: TCompositePropertyKey<Left, Right, Key> }> = Result;
type TGetProperties<Type extends TSchema, Result extends TProperties = (Type extends TObject<infer Properties extends TProperties> ? Properties : Type extends TTuple<infer Types extends TSchema[]> ? TTupleElementsToProperties<Types> : TUnreachable)> = Result;
type TComposite<Left extends TSchema, Right extends TSchema, LeftProperties extends TProperties = TGetProperties<Left>, RightProperties extends TProperties = TGetProperties<Right>, Properties extends TProperties = TCompositeProperties<LeftProperties, RightProperties>, Result extends TSchema = TObject<Properties>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/narrow.d.mts
type TNarrow<Left extends TSchema, Right extends TSchema, Result extends TCompareResult = TCompare<Left, Right>> = (Result extends typeof ResultLeftInside ? Left : Result extends typeof ResultRightInside ? Right : Result extends typeof ResultEqual ? Right : TNever);
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/distribute.d.mts
type TIsObjectLike<Type extends TSchema> = Type extends TObject | TTuple ? true : false;
type TIsUnionOperand<Left extends TSchema, Right extends TSchema, IsUnionLeft extends boolean = (Left extends TUnion ? true : false), IsUnionRight extends boolean = (Right extends TUnion ? true : false), Result extends boolean = (IsUnionLeft extends true ? true : IsUnionRight extends true ? true : false)> = Result;
type TDistributeOperation<Left extends TSchema, Right extends TSchema, EvaluatedLeft extends TSchema = TEvaluateType<Left>, EvaluatedRight extends TSchema = TEvaluateType<Right>, IsUnionOperand extends boolean = TIsUnionOperand<EvaluatedLeft, EvaluatedRight>, IsObjectLeft extends boolean = TIsObjectLike<EvaluatedLeft>, IsObjectRight extends boolean = TIsObjectLike<EvaluatedRight>, Result extends TSchema = ([IsUnionOperand] extends [true] ? TEvaluateIntersect<[EvaluatedLeft, EvaluatedRight]> : [IsObjectLeft, IsObjectRight] extends [true, true] ? TComposite<EvaluatedLeft, EvaluatedRight> : [IsObjectLeft, IsObjectRight] extends [true, false] ? EvaluatedLeft : [IsObjectLeft, IsObjectRight] extends [false, true] ? EvaluatedRight : TNarrow<EvaluatedLeft, EvaluatedRight>)> = Result;
type TDistributeType<Type extends TSchema, Distribution extends TSchema[], Result extends TSchema[] = []> = (Distribution extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TDistributeType<Type, Right, [...Result, TDistributeOperation<Type, Left>]> : Result extends [] ? [Type] : Result);
type TDistributeUnion<Types extends TSchema[], Distribution extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TDistributeUnion<Right, Distribution, [...Result, ...TDistribute$1<[Left], Distribution>]> : Result);
type TDistribute$1<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? Left extends TUnion<infer UnionTypes extends TSchema[]> ? TDistribute$1<Right, TDistributeUnion<UnionTypes, Result>> : TDistribute$1<Right, TDistributeType<Left, Result>> : Result);
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/evaluate.d.mts
type TEvaluateIntersect<Types extends TSchema[], Distribution extends TSchema[] = TDistribute$1<Types>, Result extends TSchema = TBroaden<Distribution>> = Result;
type TEvaluateUnion<Types extends TSchema[], Result extends TSchema = TBroaden<Types>> = Result;
type TEvaluateType<Type extends TSchema, Result extends TSchema = (Type extends TIntersect<infer Types extends TSchema[]> ? TEvaluateIntersect<Types> : Type extends TUnion<infer Types extends TSchema[]> ? TEvaluateUnion<Types> : Type)> = Result;
type TEvaluateUnionFast<Types extends TSchema[], Result extends TSchema = (Types extends [infer Type extends TSchema] ? Type : Types extends [] ? TNever : TUnion<Types>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_intersect.d.mts
type TFromIntersectKey<Types extends TSchema[], Value extends TSchema, EvaluatedKey extends TSchema = TEvaluateIntersect<Types>, Result extends TSchema = TFromKey<EvaluatedKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_literal.d.mts
type TFromLiteralKey<Key extends TLiteralValue, Value extends TSchema, Result extends TSchema = (Key extends string | number ? TObject<{ [_ in Key]: Value }> : Key extends false ? TObject<{
  false: Value;
}> : Key extends true ? TObject<{
  true: Value;
}> : TObject<{}>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_number.d.mts
type TFromNumberKey<Key extends TNumber, Value extends TSchema, Result extends TSchema = TRecord<typeof NumberKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_string.d.mts
type TFromStringKey<_Key extends TSchema, Value extends TSchema, Result extends TSchema = TRecord<typeof StringKey, Value>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_template_literal.d.mts
type TFromTemplateKey<Pattern extends string, Value extends TSchema, Types extends TSchema[] = TParsePatternIntoTypes<Pattern>, Finite extends boolean = TIsTemplateLiteralFinite<Types>, Result extends TSchema = (Finite extends true ? TFromKey<TTemplateLiteralDecode<Pattern>, Value> : TRecord<Pattern, Value>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/flatten.d.mts
type TFlattenType<Type extends TSchema, Result extends TSchema[] = (Type extends TUnion<infer Types extends TSchema[]> ? TFlatten<Types> : [Type])> = Result;
type TFlatten<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFlatten<Right, [...Result, ...TFlattenType<Left>]> : Result);
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key_union.d.mts
type TStringOrNumberCheck<Types extends TSchema[]> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? Left extends TString | TNumber | TInteger ? true : TStringOrNumberCheck<Right> : false);
type TTryBuildRecord<Types extends TSchema[], Value extends TSchema, Result extends TSchema | undefined = (TStringOrNumberCheck<Types> extends true ? TRecord<typeof StringKey, Value> : undefined)> = Result;
type TCreateProperties<Variants extends TSchema[], Value extends TSchema, Result extends TProperties = {}> = (Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? Left extends TLiteral<string | number> ? TCreateProperties<Right, Value, Result & { [_ in Left['const']]: Value }> : TCreateProperties<Right, Value, Result> : { [Key in keyof Result]: Result[Key] });
type TCreateObject<Variants extends TSchema[], Value extends TSchema, Properties extends TProperties = TCreateProperties<Variants, Value>, Result extends TSchema = TObject<Properties>> = Result;
type TFromUnionKey<Types extends TSchema[], Value extends TSchema, Flattened extends TSchema[] = TFlatten<Types>, Record extends TSchema | undefined = TTryBuildRecord<Flattened, Value>, Result extends TSchema = (Record extends TSchema ? Record : TCreateObject<Flattened, Value>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/from_key.d.mts
type TFromKey<Key extends TSchema, Value extends TSchema, Result extends TSchema = (Key extends TAny ? TFromAnyKey<Value> : Key extends TBoolean ? TFromBooleanKey<Value> : Key extends TEnum<infer Values extends TEnumValue[]> ? TFromEnumKey<Values, Value> : Key extends TInteger ? TFromIntegerKey<Key, Value> : Key extends TIntersect<infer Types extends TSchema[]> ? TFromIntersectKey<Types, Value> : Key extends TLiteral<infer LiteralValue extends TLiteralValue> ? TFromLiteralKey<LiteralValue, Value> : Key extends TNumber ? TFromNumberKey<Key, Value> : Key extends TString ? TFromStringKey<Key, Value> : Key extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateKey<Pattern, Value> : Key extends TUnion<infer Types extends TSchema[]> ? TFromUnionKey<Types, Value> : TObject<{}>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/record/instantiate.d.mts
type TRecordAction<Key extends TSchema, Value extends TSchema, Result extends TSchema = (TCanInstantiate<[Key]> extends true ? TFromKey<Key, Value> : TRecordDeferred<Key, Value>)> = Result;
type TRecordInstantiate<Context extends TProperties, State extends TState, Key extends TSchema, Value extends TSchema, InstantiatedKey extends TSchema = TInstantiateType<Context, State, Key>, InstantiatedValue extends TSchema = TInstantiateType<Context, State, Value>> = TRecordAction<InstantiatedKey, InstantiatedValue>;
//#endregion
//#region node_modules/typebox/build/type/types/record.d.mts
type StaticPropertyKey<Key extends string, Result extends PropertyKey = (Key extends TStringKey ? string : Key extends TIntegerKey ? number : Key extends TNumberKey ? number : Key extends `^${string}$` ? TTemplateLiteralStatic<Key> : string)> = Result;
type StaticRecord<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Key extends string, Value extends TSchema, StaticKey extends PropertyKey = StaticPropertyKey<Key>, StaticValue extends unknown = StaticType<Stack, Direction, Context, This, Value>, Result extends Record$1<PropertyKey, unknown> = Record$1<StaticKey, StaticValue>> = Result;
type TStringKey = typeof StringKey;
type TIntegerKey = typeof IntegerKey;
type TNumberKey = typeof NumberKey;
declare const IntegerKey = "^-?(?:0|[1-9][0-9]*)$";
declare const NumberKey = "^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$";
declare const StringKey = "^.*$";
interface TRecord<Key extends string = string, Value extends TSchema = TSchema> extends TSchema {
  '~kind': 'Record';
  type: 'object';
  patternProperties: { [_ in Key]: Value };
}
/** Represents a deferred Record action. */
type TRecordDeferred<Key extends TSchema = TSchema, Value extends TSchema = TSchema> = (TDeferred<'Record', [Key, Value]>);
/** Creates a Record type. */
declare function Record$1<Key extends TSchema, Value extends TSchema>(key: Key, value: Value, options?: TObjectOptions): TRecordAction<Key, Value>;
/** Returns the raw string pattern used for the Record key  */
type TRecordPattern<Type extends TRecord, Result extends string = Extract<keyof Type['patternProperties'], string>> = Result;
/** Returns the Record key as a TypeBox type  */
type TRecordKey<Type extends TRecord, Pattern extends string = TRecordPattern<Type>, Result extends TSchema = (Pattern extends typeof StringKey ? TString : Pattern extends typeof IntegerKey ? TInteger : Pattern extends typeof NumberKey ? TNumber : TTemplateLiteralDecodeUnsafe<Pattern>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/types/this.d.mts
type StaticThis<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties> = (StaticType<Stack, Direction, Context, This, TObject<This>>);
/** Represents a This type. */
interface TThis extends TSchema {
  '~kind': 'This';
  $ref: '#';
}
//#endregion
//#region node_modules/typebox/build/type/types/undefined.d.mts
type StaticUndefined = undefined;
/** Represents a Undefined type. */
interface TUndefined extends TSchema {
  '~kind': 'Undefined';
  type: 'undefined';
}
//#endregion
//#region node_modules/typebox/build/type/types/unsafe.d.mts
type StaticUnsafe<Type extends unknown> = Type;
/** Represents an Unsafe type. */
interface TUnsafe<Type extends unknown = unknown> extends TSchema {
  '~unsafe': Type;
}
//#endregion
//#region node_modules/typebox/build/type/types/void.d.mts
type StaticVoid = void;
/** Represents a Void type. */
interface TVoid extends TSchema {
  '~kind': 'Void';
  type: 'void';
}
//#endregion
//#region node_modules/typebox/build/type/extends/result.d.mts
type TResult = TExtendsUnion$1 | TExtendsTrue | TExtendsFalse;
interface TExtendsUnion$1<Inferred extends TProperties = TProperties> {
  '~kind': 'ExtendsUnion';
  inferred: Inferred;
}
interface TExtendsTrue<Inferred extends TProperties = TProperties> {
  '~kind': 'ExtendsTrue';
  inferred: Inferred;
}
interface TExtendsFalse {
  type: 'ExtendsFalse';
}
type TExtendsTrueLike<Inferred extends TProperties = TProperties> = TExtendsUnion$1<Inferred> | TExtendsTrue<Inferred>;
//#endregion
//#region node_modules/typebox/build/type/extends/extends_right.d.mts
type TExtendsRightInfer<Inferred extends TProperties, Name extends string, Left extends TSchema, Right extends TSchema, Result extends Result.TResult = (TExtendsLeft<Inferred, Left, Right> extends Result.TExtendsTrueLike<infer CheckInferred extends TProperties> ? Result.TExtendsTrue<TAssign<TAssign<Inferred, CheckInferred>, { [_ in Name]: Left }>> : Result.TExtendsFalse)> = Result;
type TExtendsRightAny<Inferred extends TProperties, _Left extends TSchema, Result extends Result.TResult = Result.TExtendsTrue<Inferred>> = Result;
type TExtendsRightEnum<Inferred extends TProperties, Left extends TSchema, Right extends TEnumValue[], Union extends TSchema = TEnumValuesToUnion<Right>> = TExtendsLeft<Inferred, Left, Union>;
type TExtendsRightIntersect<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]> = (Right extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsLeft<Inferred, Left, Head> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsRightIntersect<Inferred, Left, Tail> : TExtendsFalse : TExtendsTrue<Inferred>);
type TExtendsRightTemplateLiteral<Inferred extends TProperties, Left extends TSchema, Right extends string, Decoded extends TSchema = TTemplateLiteralDecode<Right>> = TExtendsLeft<Inferred, Left, Decoded>;
type TExtendsRightUnion<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]> = (Right extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsLeft<Inferred, Left, Head> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsTrue<Inferred> : TExtendsRightUnion<Inferred, Left, Tail> : TExtendsFalse);
type TExtendsRight<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TAny ? TExtendsRightAny<Inferred, Left> : Right extends TEnum<infer Values extends TEnumValue[]> ? TExtendsRightEnum<Inferred, Left, Values> : Right extends TInfer<infer Name extends string, infer Type extends TSchema> ? TExtendsRightInfer<Inferred, Name, Left, Type> : Right extends TTemplateLiteral<infer Pattern extends string> ? TExtendsRightTemplateLiteral<Inferred, Left, Pattern> : Right extends TIntersect<infer Types extends TSchema[]> ? TExtendsRightIntersect<Inferred, Left, Types> : Right extends TUnion<infer Types extends TSchema[]> ? TExtendsRightUnion<Inferred, Left, Types> : Right extends TUnknown ? TExtendsTrue<Inferred> : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/extends/any.d.mts
type TExtendsAny<Inferred extends TProperties, Left extends TAny, Right extends TSchema> = (Right extends TInfer ? TExtendsRight<Inferred, Left, Right> : Right extends TAny ? TExtendsTrue<Inferred> : Right extends TUnknown ? TExtendsTrue<Inferred> : TExtendsUnion$1<Inferred>);
//#endregion
//#region node_modules/typebox/build/type/extends/array.d.mts
type TExtendsImmutable<Left extends TSchema, Right extends TSchema, IsImmutableLeft extends boolean = (Left extends TImmutable ? true : false), IsImmutableRight extends boolean = (Right extends TImmutable ? true : false), Result extends boolean = ([IsImmutableLeft, IsImmutableRight] extends [true, true] ? true : [IsImmutableLeft, IsImmutableRight] extends [false, true] ? true : [IsImmutableLeft, IsImmutableRight] extends [true, false] ? false : true)> = Result;
type TExtendsArray<Inferred extends TProperties, ArrayLeft extends TSchema, Left extends TSchema, Right extends TSchema> = (Right extends TArray<infer Type extends TSchema> ? TExtendsImmutable<ArrayLeft, Right> extends true ? TExtendsLeft<Inferred, Left, Type> : TExtendsFalse : TExtendsRight<Inferred, ArrayLeft, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/async_iterator.d.mts
type TExtendsAsyncIterator<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TAsyncIterator<infer Type extends TSchema> ? TExtendsLeft<Inferred, Left, Type> : TExtendsRight<Inferred, TAsyncIterator<Left>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/bigint.d.mts
type TExtendsBigInt<Inferred extends TProperties, Left extends TBigInt, Right extends TSchema> = (Right extends TBigInt ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/boolean.d.mts
type TExtendsBoolean<Inferred extends TProperties, Left extends TBoolean, Right extends TSchema> = (Right extends TBoolean ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/parameters.d.mts
type TParameterCompare<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[], CheckLeft extends TSchema = (Right extends TInfer ? Left : Right), CheckRight extends TSchema = (Right extends TInfer ? Right : Left), IsLeftOptional extends boolean = (Left extends TOptional ? true : false), IsRightOptional extends boolean = (Right extends TOptional ? true : false)> = ([IsLeftOptional, IsRightOptional] extends [false, true] ? TExtendsFalse : TExtendsLeft<Inferred, CheckLeft, CheckRight> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsParameters<Inferred, LeftRest, RightRest> : TExtendsFalse);
type TParameterRight<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], RightRest extends TSchema[]> = (RightRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TParameterCompare<Inferred, Left, LeftRest, Head, Tail> : Left extends TOptional ? TExtendsTrue<Inferred> : TExtendsFalse);
type TParameterLeft<Inferred extends TProperties, LeftRest extends TSchema[], RightRest extends TSchema[]> = (LeftRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TParameterRight<Inferred, Head, Tail, RightRest> : TExtendsTrue<Inferred>);
type TExtendsParameters<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]> = TParameterLeft<Inferred, Left, Right>;
//#endregion
//#region node_modules/typebox/build/type/extends/return_type.d.mts
type TExtendsReturnType<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TVoid ? TExtendsTrue<Inferred> : TExtendsLeft<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/constructor.d.mts
type TExtendsConstructor<Inferred extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema, Right extends TSchema> = (Right extends TAny ? TExtendsTrue<Inferred> : Right extends TUnknown ? TExtendsTrue<Inferred> : Right extends TConstructor ? TExtendsParameters<Inferred, Parameters, Right['parameters']> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsReturnType<Inferred, InstanceType, Right['instanceType']> : TExtendsFalse : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/extends/enum.d.mts
type TExtendsEnum<Inferred extends TProperties, Left extends TEnum, Right extends TSchema> = (TExtendsLeft<Inferred, TEnumToUnion<Left>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/function.d.mts
type TExtendsFunction<Inferred extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema, Right extends TSchema> = (Right extends TAny ? TExtendsTrue<Inferred> : Right extends TUnknown ? TExtendsTrue<Inferred> : Right extends TFunction ? TExtendsParameters<Inferred, Parameters, Right['parameters']> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsReturnType<Inferred, ReturnType, Right['returnType']> : TExtendsFalse : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/extends/integer.d.mts
type TExtendsInteger<Inferred extends TProperties, Left extends TInteger, Right extends TSchema> = (Right extends TInteger ? TExtendsTrue<Inferred> : Right extends TNumber ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/intersect.d.mts
type TExtendsIntersect<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema, Evaluated extends TSchema = TEvaluateIntersect<Left>> = TExtendsLeft<Inferred, Evaluated, Right>;
//#endregion
//#region node_modules/typebox/build/type/extends/iterator.d.mts
type TExtendsIterator<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TIterator<infer Type extends TSchema> ? TExtendsLeft<Inferred, Left, Type> : TExtendsRight<Inferred, TIterator<Left>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/literal.d.mts
type TExtendsLiteralValue<Inferred extends TProperties, Left extends TLiteralValue, Right extends TLiteralValue> = (Left extends Right ? TExtendsTrue<Inferred> : TExtendsFalse);
type TExtendsLiteralBigInt<Inferred extends TProperties, Left extends bigint, Right extends TSchema> = (Right extends TLiteral<infer Value extends bigint> ? TExtendsLiteralValue<Inferred, Left, Value> : Right extends TBigInt ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, TLiteral<Left>, Right>);
type TExtendsLiteralBoolean<Inferred extends TProperties, Left extends boolean, Right extends TSchema> = (Right extends TLiteral<infer Value extends boolean> ? TExtendsLiteralValue<Inferred, Left, Value> : Right extends TBoolean ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, TLiteral<Left>, Right>);
type TExtendsLiteralNumber<Inferred extends TProperties, Left extends number, Right extends TSchema> = (Right extends TLiteral<infer Value extends number> ? TExtendsLiteralValue<Inferred, Left, Value> : Right extends TNumber ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, TLiteral<Left>, Right>);
type TExtendsLiteralString<Inferred extends TProperties, Left extends string, Right extends TSchema> = (Right extends TLiteral<infer Value extends string> ? TExtendsLiteralValue<Inferred, Left, Value> : Right extends TString ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, TLiteral<Left>, Right>);
type TExtendsLiteral<Inferred extends TProperties, Left extends TLiteral, Right extends TSchema> = (Left extends TLiteral<infer Value extends bigint> ? TExtendsLiteralBigInt<Inferred, Value, Right> : Left extends TLiteral<infer Value extends boolean> ? TExtendsLiteralBoolean<Inferred, Value, Right> : Left extends TLiteral<infer Value extends number> ? TExtendsLiteralNumber<Inferred, Value, Right> : Left extends TLiteral<infer Value extends string> ? TExtendsLiteralString<Inferred, Value, Right> : TUnreachable);
//#endregion
//#region node_modules/typebox/build/type/extends/never.d.mts
type TExtendsNever<Inferred extends TProperties, Left extends TNever, Right extends TSchema> = (Right extends TInfer ? TExtendsRight<Inferred, Left, Right> : TExtendsTrue<Inferred>);
//#endregion
//#region node_modules/typebox/build/type/extends/null.d.mts
type TExtendsNull<Inferred extends TProperties, Left extends TNull, Right extends TSchema> = (Right extends TNull ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/number.d.mts
type TExtendsNumber<Inferred extends TProperties, Left extends TNumber, Right extends TSchema> = (Right extends TNumber ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/object.d.mts
type TExtendsPropertyOptional<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Left extends TOptional<Left> ? Right extends TOptional<Right> ? TExtendsTrue<Inferred> : TExtendsFalse : TExtendsTrue<Inferred>);
type TExtendsProperty<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TInfer<string, TNever> ? TExtendsFalse : TExtendsLeft<Inferred, Left, Right> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsPropertyOptional<Inferred, Left, Right> : TExtendsFalse);
type TExtractInferredProperties<Keys extends PropertyKey[], Properties extends Record<PropertyKey, Result.TResult>, Result extends TProperties = {}> = (Keys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]] ? Left extends keyof Properties ? Properties[Left] extends Result.TExtendsTrueLike<infer Inferred extends TProperties> ? TExtractInferredProperties<Right, Properties, Result & Inferred> : TExtractInferredProperties<Right, Properties, Result> : TUnreachable : Result);
type TExtendsPropertiesComparer<Inferred extends TProperties, Left extends TProperties, Right extends TProperties, Properties extends Record<PropertyKey, TExtendsTrue | TExtendsFalse> = { [RightKey in keyof Right]: (RightKey extends keyof Left ? TExtendsProperty<{}, Left[RightKey], Right[RightKey]> : Right[RightKey] extends TOptional<Right[RightKey]> ? Right[RightKey] extends TInfer ? TExtendsTrue<TAssign<Inferred, { [_ in Right[RightKey]['name']]: Right[RightKey]['extends'] }>> : TExtendsTrue<Inferred> : TExtendsFalse) }, Checked extends boolean = (Properties[keyof Right] extends TExtendsTrueLike ? true : false), Extracted extends TProperties = (Checked extends true ? TExtractInferredProperties<TUnionToTuple<keyof Properties>, Properties> : {})> = (Checked extends true ? TExtendsTrue<Extracted> : TExtendsFalse);
type TExtendsProperties<Inferred extends TProperties, Left extends TProperties, Right extends TProperties, Compared extends TResult = TExtendsPropertiesComparer<Inferred, Left, Right>> = (Compared extends TExtendsTrueLike<infer ComparedInferred extends TProperties> ? TExtendsTrue<TAssign<Inferred, ComparedInferred>> : TExtendsFalse);
type TExtendsObjectToObject<Inferred extends TProperties, Left extends TProperties, Right extends TProperties> = (TExtendsProperties<Inferred, Left, Right>);
type TExtendsObject<Inferred extends TProperties, Left extends TProperties, Right extends TSchema> = (Right extends TObject<infer Properties extends TProperties> ? TExtendsObjectToObject<Inferred, Left, Properties> : TExtendsRight<Inferred, TObject<Left>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/promise.d.mts
type TExtendsPromise<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Right extends TPromise<infer Type extends TSchema> ? TExtendsLeft<Inferred, Left, Type> : TExtendsRight<Inferred, TPromise<Left>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/string.d.mts
type TExtendsString<Inferred extends TProperties, Left extends TString, Right extends TSchema> = (Right extends TString ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/symbol.d.mts
type TExtendsSymbol<Inferred extends TProperties, Left extends TSymbol, Right extends TSchema> = (Right extends TSymbol ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/template_literal.d.mts
type TExtendsTemplateLiteral<Inferred extends TProperties, Left extends string, Right extends TSchema, Decoded extends TSchema = TTemplateLiteralDecode<Left>> = TExtendsLeft<Inferred, Decoded, Right>;
//#endregion
//#region node_modules/typebox/build/type/extends/inference.d.mts
interface TInferable<Name extends string = string, Type extends TSchema = TSchema> {
  '~kind': 'Inferrable';
  name: Name;
  type: Type;
}
type TTryRestInferable<Type extends TSchema, Result extends TInferable | undefined = (Type extends TRest<infer RestType extends TSchema> ? RestType extends TInfer<infer Name extends string, infer Type extends TSchema> ? Type extends TArray<infer Type extends TSchema> ? TInferable<Name, Type> : Type extends TUnknown ? TInferable<Name, Type> : undefined : TUnreachable : undefined)> = Result;
type TTryInferable<Type extends TSchema, Result extends TInferable | undefined = (Type extends TInfer<infer Name extends string, infer Type extends TSchema> ? TInferable<Name, Type> : undefined)> = Result;
type TryInferResults<Rest extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (Rest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsLeft<{}, Head, Right> extends Result.TExtendsTrueLike ? TryInferResults<Tail, Right, [...Result, Head]> : undefined : Result);
declare function TryInferResults<Rest extends TSchema[], Right extends TSchema>(rest: [...Rest], right: Right, result?: TSchema[]): TryInferResults<Rest, Right>;
type TInferTupleResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema, Results extends TSchema[] | undefined = TryInferResults<Left, Right>> = (Results extends [...infer Results extends TSchema[]] ? TExtendsTrue<TAssign<Inferred, { [_ in Name]: TTuple<Results> }>> : TExtendsFalse);
type TInferUnionResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema, Results extends TSchema[] | undefined = TryInferResults<Left, Right>> = (Results extends [...infer Results extends TSchema[]] ? TExtendsTrue<TAssign<Inferred, { [_ in Name]: TUnion<Results> }>> : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/extends/tuple.d.mts
type TReverse<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TReverse<Right, [Left, ...Result]> : Result);
type TApplyReverse<Types extends TSchema[], Reversed extends boolean> = Reversed extends true ? TReverse<Types> : Types;
type TReversed<Types extends TSchema[], First extends TSchema | undefined = (Types extends [infer Left extends TSchema, ...infer _ extends TSchema[]] ? Left : undefined), Inferable extends TSchema | undefined = (First extends TSchema ? TTryRestInferable<First> : undefined), Result extends boolean = (Inferable extends TSchema ? true : false)> = Result;
type TElementsCompare<Inferred extends TProperties, Reversed extends boolean, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[]> = (TExtendsLeft<Inferred, Left, Right> extends TExtendsTrueLike<infer CheckInferred extends TProperties> ? TElements<CheckInferred, Reversed, LeftRest, RightRest> : TExtendsFalse);
type TElementsLeft<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[], Inferable extends TInferable | undefined = TTryRestInferable<Right>> = (Inferable extends TInferable ? TInferTupleResult<Inferred, Inferable['name'], TApplyReverse<LeftRest, Reversed>, Inferable['type']> : LeftRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TElementsCompare<Inferred, Reversed, Head, Tail, Right, RightRest> : TExtendsFalse);
type TElementsRight<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]> = (RightRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TElementsLeft<Inferred, Reversed, LeftRest, Head, Tail> : LeftRest['length'] extends 0 ? TExtendsTrue<Inferred> : TExtendsFalse);
type TElements<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]> = TElementsRight<Inferred, Reversed, LeftRest, RightRest>;
type TExtendsTupleToTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[], InstantiatedRight extends TSchema[] = TInstantiateElements<Inferred, {
  callstack: [];
}, Right>, Reversed extends boolean = TReversed<InstantiatedRight>> = TElements<Inferred, Reversed, TApplyReverse<Left, Reversed>, TApplyReverse<InstantiatedRight, Reversed>>;
type TExtendsTupleToArray<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema, Inferrable extends TInferable | undefined = TTryInferable<Right>> = (Inferrable extends TInferable ? TInferUnionResult<Inferred, Inferrable['name'], Left, Inferrable['type']> : Left extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsLeft<Inferred, Head, Right> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsTupleToArray<Inferred, Tail, Right> : TExtendsFalse : TExtendsTrue<Inferred>);
type TExtendsTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema, InstantiatedLeft extends TSchema[] = TInstantiateElements<Inferred, {
  callstack: [];
}, Left>> = (Right extends TTuple<infer Types extends TSchema[]> ? TExtendsTupleToTuple<Inferred, InstantiatedLeft, Types> : Right extends TArray<infer Type extends TSchema> ? TExtendsTupleToArray<Inferred, InstantiatedLeft, Type> : TExtendsRight<Inferred, TTuple<InstantiatedLeft>, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/undefined.d.mts
type TExtendsUndefined<Inferred extends TProperties, Left extends TUndefined, Right extends TSchema> = (Right extends TVoid ? TExtendsTrue<Inferred> : Right extends TUndefined ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/union.d.mts
type TExtendsUnionSome<Inferred extends TProperties, Type extends TSchema, UnionTypes extends TSchema[]> = (UnionTypes extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsLeft<Inferred, Type, Head> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsTrue<Inferred> : TExtendsUnionSome<Inferred, Type, Tail> : TExtendsFalse);
type TExtendsUnionLeft<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]> = (Left extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtendsUnionSome<Inferred, Head, Right> extends TExtendsTrueLike<infer Inferred extends TProperties> ? TExtendsUnionLeft<Inferred, Tail, Right> : TExtendsFalse : TExtendsTrue<Inferred>);
type TExtendsUnion<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema, Inferrable extends TInferable | undefined = TTryInferable<Right>> = (Inferrable extends TInferable<infer Name extends string, infer Type extends TSchema> ? TInferUnionResult<Inferred, Name, Left, Type> : Right extends TUnion<infer Types extends TSchema[]> ? TExtendsUnionLeft<Inferred, Left, Types> : TExtendsUnionLeft<Inferred, Left, [Right]>);
//#endregion
//#region node_modules/typebox/build/type/extends/unknown.d.mts
type TExtendsUnknown<Inferred extends TProperties, Left extends TUnknown, Right extends TSchema> = (Right extends TInfer ? TExtendsRight<Inferred, Left, Right> : Right extends TAny ? TExtendsTrue<Inferred> : Right extends TUnknown ? TExtendsTrue<Inferred> : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/extends/void.d.mts
type TExtendsVoid<Inferred extends TProperties, Left extends TVoid, Right extends TSchema> = (Right extends TVoid ? TExtendsTrue<Inferred> : TExtendsRight<Inferred, Left, Right>);
//#endregion
//#region node_modules/typebox/build/type/extends/extends_left.d.mts
type TExtendsLeft<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (Left extends TAny ? TExtendsAny<Inferred, Left, Right> : Left extends TArray<infer Items extends TSchema> ? TExtendsArray<Inferred, Left, Items, Right> : Left extends TAsyncIterator<infer Type extends TSchema> ? TExtendsAsyncIterator<Inferred, Type, Right> : Left extends TBigInt ? TExtendsBigInt<Inferred, Left, Right> : Left extends TBoolean ? TExtendsBoolean<Inferred, Left, Right> : Left extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TExtendsConstructor<Inferred, Parameters, InstanceType, Right> : Left extends TEnum<infer Values extends TEnumValue[]> ? TExtendsEnum<Inferred, TEnum<Values>, Right> : Left extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TExtendsFunction<Inferred, Parameters, ReturnType, Right> : Left extends TInteger ? TExtendsInteger<Inferred, Left, Right> : Left extends TIntersect<infer Types extends TSchema[]> ? TExtendsIntersect<Inferred, Types, Right> : Left extends TIterator<infer Type extends TSchema> ? TExtendsIterator<Inferred, Type, Right> : Left extends TLiteral ? TExtendsLiteral<Inferred, Left, Right> : Left extends TNever ? TExtendsNever<Inferred, Left, Right> : Left extends TNull ? TExtendsNull<Inferred, Left, Right> : Left extends TNumber ? TExtendsNumber<Inferred, Left, Right> : Left extends TObject<infer Properties extends TProperties> ? TExtendsObject<Inferred, Properties, Right> : Left extends TPromise<infer Type extends TSchema> ? TExtendsPromise<Inferred, Type, Right> : Left extends TString ? TExtendsString<Inferred, Left, Right> : Left extends TSymbol ? TExtendsSymbol<Inferred, Left, Right> : Left extends TTemplateLiteral<infer Pattern extends string> ? TExtendsTemplateLiteral<Inferred, Pattern, Right> : Left extends TTuple<infer Types extends TSchema[]> ? TExtendsTuple<Inferred, Types, Right> : Left extends TUndefined ? TExtendsUndefined<Inferred, Left, Right> : Left extends TUnion<infer Types extends TSchema[]> ? TExtendsUnion<Inferred, Types, Right> : Left extends TUnknown ? TExtendsUnknown<Inferred, Left, Right> : Left extends TVoid ? TExtendsVoid<Inferred, Left, Right> : TExtendsFalse);
//#endregion
//#region node_modules/typebox/build/type/engine/interface/instantiate.d.mts
type TInterfaceOperation<Heritage extends TSchema[], Properties extends TProperties, Result extends TSchema = TEvaluateIntersect<[...Heritage, TObject<Properties>]>> = Result;
type TInterfaceAction<Heritage extends TSchema[], Properties extends TProperties, Result extends TSchema = (TCanInstantiate<Heritage> extends true ? TInterfaceOperation<Heritage, Properties> : TInterfaceDeferred<Heritage, Properties>)> = Result;
type TInterfaceInstantiate<Context extends TProperties, State extends TState, Heritage extends TSchema[], Properties extends TProperties, InstantiatedHeritage extends TSchema[] = TInstantiateTypes<Context, {
  callstack: [];
}, Heritage>, InstantiatedProperties extends TProperties = TInstantiateProperties<Context, {
  callstack: [];
}, Properties>> = TInterfaceAction<InstantiatedHeritage, InstantiatedProperties>;
//#endregion
//#region node_modules/typebox/build/type/action/interface.d.mts
/** Creates a deferred Interface action. */
type TInterfaceDeferred<Heritage extends TSchema[] = TSchema[], Properties extends TProperties = TProperties> = (TDeferred<'Interface', [Heritage, Properties]>);
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/check.d.mts
type TFromRef$3<Stack extends string[], Context extends TProperties, Ref extends string> = Ref extends Stack[number] ? true : TFromType$15<[...Stack, Ref], Context, Context[Ref]>;
type TFromProperties$2<Stack extends string[], Context extends TProperties, Properties extends TProperties, Types extends TSchema[] = TPropertyValues<Properties>> = TFromTypes$3<Stack, Context, Types>;
type TFromTypes$3<Stack extends string[], Context extends TProperties, Types extends TSchema[]> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromType$15<Stack, Context, Left> extends true ? true : TFromTypes$3<Stack, Context, Right> : false;
type TFromType$15<Stack extends string[], Context extends TProperties, Type extends TSchema> = (Type extends TRef<infer Ref extends string> ? TFromRef$3<Stack, Context, Ref> : Type extends TArray<infer Type extends TSchema> ? TFromType$15<Stack, Context, Type> : Type extends TAsyncIterator<infer Type extends TSchema> ? TFromType$15<Stack, Context, Type> : Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromTypes$3<Stack, Context, [...Parameters, InstanceType]> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromTypes$3<Stack, Context, [...Parameters, ReturnType]> : Type extends TInterfaceDeferred<TSchema[], infer Properties extends TProperties> ? TFromProperties$2<Stack, Context, Properties> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromTypes$3<Stack, Context, Types> : Type extends TIterator<infer Type extends TSchema> ? TFromType$15<Stack, Context, Type> : Type extends TObject<infer Properties extends TProperties> ? TFromProperties$2<Stack, Context, Properties> : Type extends TPromise<infer Type extends TSchema> ? TFromType$15<Stack, Context, Type> : Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes$3<Stack, Context, Types> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTypes$3<Stack, Context, Types> : Type extends TRecord<string, infer Type extends TSchema> ? TFromType$15<Stack, Context, Type> : false);
/** Performs a cyclic check on the given type. Initial key stack can be empty, but faster if specified */
type TCyclicCheck<Stack extends string[], Context extends TProperties, Type extends TSchema, Result extends boolean = TFromType$15<Stack, Context, Type>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/candidates.d.mts
type TResolveCandidateKeys<Context extends TProperties, Keys extends string[], Result extends string[] = []> = (Keys extends [infer Left extends string, ...infer Right extends string[]] ? Left extends keyof Context ? TCyclicCheck<[Left], Context, Context[Left]> extends true ? TResolveCandidateKeys<Context, Right, [...Result, Left]> : TResolveCandidateKeys<Context, Right, Result> : TUnreachable : Result);
/** Returns keys for context types that need to be transformed to TCyclic. */
type TCyclicCandidates<Context extends TProperties, Keys extends string[] = TPropertyKeys<Context>, Result extends string[] = TResolveCandidateKeys<Context, Keys>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/dependencies.d.mts
type TFromRef$2<Context extends TProperties, Ref extends string, Dependencies extends string[]> = Ref extends Dependencies[number] ? Dependencies : Ref extends keyof Context ? TFromType$14<Context, Context[Ref], [...Dependencies, Ref]> : TUnreachable;
type TFromProperties$1<Context extends TProperties, Properties extends TProperties, Dependencies extends string[], Types extends TSchema[] = TPropertyValues<Properties>> = TFromTypes$2<Context, Types, Dependencies>;
type TFromTypes$2<Context extends TProperties, Types extends TSchema[], Dependencies extends string[]> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromTypes$2<Context, Right, TFromType$14<Context, Left, Dependencies>> : Dependencies;
type TFromType$14<Context extends TProperties, Type extends TSchema, Result extends string[]> = (Type extends TRef<infer Ref extends string> ? TFromRef$2<Context, Ref, Result> : Type extends TArray<infer Type extends TSchema> ? TFromType$14<Context, Type, Result> : Type extends TAsyncIterator<infer Type extends TSchema> ? TFromType$14<Context, Type, Result> : Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromTypes$2<Context, [...Parameters, InstanceType], Result> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromTypes$2<Context, [...Parameters, ReturnType], Result> : Type extends TInterfaceDeferred<TSchema[], infer Properties extends TProperties> ? TFromProperties$1<Context, Properties, Result> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromTypes$2<Context, Types, Result> : Type extends TIterator<infer Type extends TSchema> ? TFromType$14<Context, Type, Result> : Type extends TObject<infer Properties extends TProperties> ? TFromProperties$1<Context, Properties, Result> : Type extends TPromise<infer Type extends TSchema> ? TFromType$14<Context, Type, Result> : Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes$2<Context, Types, Result> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTypes$2<Context, Types, Result> : Type extends TRecord<string, infer Type extends TSchema> ? TFromType$14<Context, Type, Result> : Result);
/** Returns dependent cyclic keys for the given type. This function is used to dead-type-eliminate (DTE) for initializing TCyclic types. */
type TCyclicDependencies<Context extends TProperties, Key extends string, Type extends TSchema, Result extends string[] = TFromType$14<Context, Type, [Key]>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/extends.d.mts
type TFromRef$1<_Ref extends string> = (TAny);
type TFromProperties<Properties extends TProperties, Result extends TProperties = { [Key in keyof Properties]: TFromType$13<Properties[Key]> }> = { [Key in keyof Result]: Result[Key] };
type TFromTypes$1<Types extends TSchema[], Result extends TSchema[] = []> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromTypes$1<Right, [...Result, TFromType$13<Left>]> : Result;
type TFromType$13<Type extends TSchema> = (Type extends TRef<infer Ref extends string> ? TFromRef$1<Ref> : Type extends TArray<infer Type extends TSchema> ? TArray<TFromType$13<Type>> : Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TFromType$13<Type>> : Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFunction<TFromTypes$1<Parameters>, TFromType$13<InstanceType>> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TFromTypes$1<Parameters>, TFromType$13<ReturnType>> : Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromTypes$1<Types>> : Type extends TIterator<infer Type extends TSchema> ? TIterator<TFromType$13<Type>> : Type extends TObject<infer Properties extends TProperties> ? TObject<TFromProperties<Properties>> : Type extends TPromise<infer Type extends TSchema> ? TPromise<TFromType$13<Type>> : Type extends TRecord<infer Pattern extends string, infer Value extends TSchema> ? TRecord<Pattern, TFromType$13<Value>> : Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromTypes$1<Types>> : Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TFromTypes$1<Types>> : Type);
type TCyclicAnyFromParameters<Defs extends TProperties, Ref extends string> = (Ref extends keyof Defs ? TFromType$13<Defs[Ref]> : TUnknown);
/** Transforms TCyclic TRef's into TAny's. This function is used prior to TExtends checks to enable cyclics to be structurally checked and terminated (with TAny) at first point of recursion, what would otherwise be a recursive TRef.*/
type TCyclicExtends<Type extends TCyclic, Result extends TSchema = TCyclicAnyFromParameters<Type['$defs'], Type['$ref']>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/instantiate.d.mts
type TCyclicInterface<Context extends TProperties, Heritage extends TSchema[], Properties extends TProperties, InstantiatedHeritage extends TSchema[] = TInstantiateTypes<Context, {
  callstack: [];
}, Heritage>, instantiatedProperties extends TProperties = TInstantiateProperties<{}, {
  callstack: [];
}, Properties>, EvaluatedInterface extends TSchema = TEvaluateIntersect<[...InstantiatedHeritage, TObject<instantiatedProperties>]>> = EvaluatedInterface;
type TCyclicDefinitions<Context extends TProperties, Dependencies extends string[], Result extends TProperties = { [Key in Extract<keyof Context, Dependencies[number]>]: Context[Key] extends TInterfaceDeferred<infer Heritage extends TSchema[], infer Properties extends TProperties> ? TCyclicInterface<Context, Heritage, Properties> : Context[Key] }> = Result;
type TInstantiateCyclic<Context extends TProperties, Ref extends string, Type extends TSchema, Dependencies extends string[] = TCyclicDependencies<Context, Ref, Type>, Definitions extends TProperties = TCyclicDefinitions<Context, Dependencies>, Result extends TSchema = TCyclic<Definitions, Ref>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/cyclic/target.d.mts
type TResolve$1<Defs extends TProperties, Ref extends string> = (Ref extends keyof Defs ? Defs[Ref] extends TRef<infer Ref extends string> ? TResolve$1<Defs, Ref> : Defs[Ref] : TNever);
/** Returns the target Type from the Defs or Never if target is non-resolvable */
type TCyclicTarget<Defs extends TProperties, Ref extends string, Result extends TSchema = TResolve$1<Defs, Ref>> = Result;
//#endregion
//#region node_modules/typebox/build/type/extends/extends.d.mts
type TCanonical<Type extends TSchema> = (Type extends TCyclic ? TCyclicExtends<Type> : Type extends TUnsafe ? TUnknown : Type);
/** Performs a structural extends check on left and right types and yields inferred types on right if specified. */
type TExtends<Inferred extends TProperties, Left extends TSchema, Right extends TSchema, CanonicalLeft extends TSchema = TCanonical<Left>, CanonicalRight extends TSchema = TCanonical<Right>> = TExtendsLeft<Inferred, CanonicalLeft, CanonicalRight>;
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/compare.d.mts
declare const ResultEqual = "equal";
declare const ResultDisjoint = "disjoint";
declare const ResultLeftInside = "left-inside";
declare const ResultRightInside = "right-inside";
type TCompareResult = typeof ResultEqual | typeof ResultDisjoint | typeof ResultLeftInside | typeof ResultRightInside;
/** Compares left and right types and determines their set relationship */
type TCompare<Left extends TSchema, Right extends TSchema, Extends extends [TResult, TResult] = [Left extends TUnknown ? TExtendsFalse : TExtends<{}, Left, Right>, Left extends TUnknown ? TExtendsTrue : TExtends<{}, Right, Left>]> = (Extends extends [TExtendsTrueLike, TExtendsTrueLike] ? typeof ResultEqual : Extends extends [TExtendsTrueLike, TExtendsFalse] ? typeof ResultLeftInside : Extends extends [TExtendsFalse, TExtendsTrueLike] ? typeof ResultRightInside : typeof ResultDisjoint);
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/broaden.d.mts
type TBroadFilter<Type extends TSchema, Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TCompare<Type, Left> extends typeof ResultRightInside ? TBroadFilter<Type, Right, [...Result]> : TBroadFilter<Type, Right, [...Result, Left]> : Result);
type TIsBroadestType<Type extends TSchema, Types extends TSchema[]> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TCompare<Type, Left> extends typeof ResultLeftInside | typeof ResultEqual ? false : TIsBroadestType<Type, Right> : true);
type TBroadenType<Type extends TSchema, Types extends TSchema[], Evaluated extends TSchema = TEvaluateType<Type>, Result extends TSchema[] = (Evaluated extends TAny ? [Evaluated] : TIsBroadestType<Evaluated, Types> extends true ? [...TBroadFilter<Evaluated, Types>, Evaluated] : Types)> = Result;
type TBroadenTypes<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? (Left extends TObject ? TBroadenTypes<Right, [...Result, Left]> : Left extends TNever ? TBroadenTypes<Right, Result> : TBroadenTypes<Right, TBroadenType<Left, Result>>) : Result);
type TBroaden<Types extends TSchema[], Broadened extends TSchema[] = TBroadenTypes<Types>, Flattened extends TSchema[] = TFlatten<Broadened>, Result extends TSchema = (Flattened extends [] ? TNever : Flattened extends [infer Type extends TSchema] ? Type : TUnion<Flattened>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/evaluate/instantiate.d.mts
type TEvaluateAction<Type extends TSchema, Result extends TSchema = TEvaluateType<Type>> = Result;
type TEvaluateInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TEvaluateAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/engine/call/distribute_arguments.d.mts
type TCollectDistributionNames<Expression extends TSchema, Result extends string[] = []> = (Expression extends TDeferred<'Conditional', [infer Left extends TSchema, infer _Right extends TSchema, infer True extends TSchema, infer False extends TSchema]> ? Left extends TRef ? TCollectDistributionNames<True, TCollectDistributionNames<False, [...Result, Left['$ref']]>> : TCollectDistributionNames<True, TCollectDistributionNames<False, Result>> : Expression extends TDeferred<'Mapped', [infer _Identifier extends TSchema, infer Type extends TSchema, infer _As extends TSchema, infer _Property extends TSchema]> ? (Type extends TDeferred<'KeyOf', [infer Ref extends TRef]> ? [...Result, Ref['$ref']] : Result) : Result);
type TBuildDistributionArray<Parameters extends TParameter[], Names extends string[], Result extends boolean[] = []> = (Parameters extends [infer Left extends TParameter, ...infer Right extends TParameter[]] ? Left['name'] extends Names[number] ? TBuildDistributionArray<Right, Names, [...Result, true]> : TBuildDistributionArray<Right, Names, [...Result, false]> : Result);
type TZipDistributionArray<Arguments extends TSchema[], DistributionArray extends boolean[], Result extends [boolean, TSchema][] = []> = (Arguments extends [infer ArgumentLeft extends TSchema, ...infer ArgumentRight extends TSchema[]] ? DistributionArray extends [infer BooleanLeft extends boolean, ...infer BooleanRight extends boolean[]] ? TZipDistributionArray<ArgumentRight, BooleanRight, [...Result, [BooleanLeft, ArgumentLeft]]> : Result : Result);
type TExpand<Type extends TSchema> = (Type extends TUnion<infer Types extends TSchema[]> ? [...Types] : [Type]);
type TAppend<Current extends TSchema[][], Type extends TSchema, Result extends TSchema[][] = []> = (Current extends [infer Left extends TSchema[], ...infer Right extends TSchema[][]] ? TAppend<Right, Type, [...Result, [...Left, Type]]> : Result);
type TCross<Current extends TSchema[][], Variants extends TSchema[], Result extends TSchema[][] = []> = (Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TCross<Current, Right, [...Result, ...TAppend<Current, Left>]> : Result);
type TDistribute<ZippedArguments extends [boolean, TSchema][], Result extends TSchema[][] = [[]]> = (ZippedArguments extends [infer Left extends [boolean, TSchema], ...infer Right extends [boolean, TSchema][]] ? Left[0] extends true ? TDistribute<Right, TCross<Result, TExpand<Left[1]>>> : TDistribute<Right, TCross<Result, [Left[1]]>> : Result);
type TDistributeArguments<Parameters extends TParameter[], Arguments extends TSchema[], Expression extends TSchema, DistributionNames extends string[] = TCollectDistributionNames<Expression>, DistributionArray extends boolean[] = TBuildDistributionArray<Parameters, DistributionNames>, ZippedArguments extends [boolean, TSchema][] = TZipDistributionArray<Arguments, DistributionArray>, Result extends TSchema[][] = (Expression extends TDeferred<'Conditional', TSchema[]> ? TDistribute<ZippedArguments> : Expression extends TDeferred<'Mapped', TSchema[]> ? TDistribute<ZippedArguments> : [Arguments])> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/call/resolve_target.d.mts
type TFromNotResolvable = (['(not-resolvable)', TNever]);
type TFromNotGeneric = (['(not-generic)', TNever]);
type TFromGeneric<Name extends string, Parameters extends TParameter[], Expression extends TSchema> = ([Name, TGeneric<Parameters, Expression>]);
type TFromRef<Context extends TProperties, Ref extends string, Arguments extends TSchema[]> = (Ref extends keyof Context ? TFromType$12<Context, Ref, Context[Ref], Arguments> : TFromNotResolvable);
type TFromType$12<Context extends TProperties, Name extends string, Type extends TSchema, Arguments extends TSchema[]> = (Type extends TGeneric<infer Parameters extends TParameter[], infer Expression extends TSchema> ? TFromGeneric<Name, Parameters, Expression> : Type extends TRef<infer Ref extends string> ? TFromRef<Context, Ref, Arguments> : TFromNotGeneric);
/** Resolves a named generic target from the context, or returns TNever if it cannot be resolved or is not generic. */
type TResolveTarget<Context extends TProperties, Target extends TSchema, Arguments extends TSchema[], Result extends [string, TSchema] = TFromType$12<Context, '(anonymous)', Target, Arguments>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/call/resolve_arguments.d.mts
type TBindArgument<Context extends TProperties, State extends TState, Name extends string, Extends extends TSchema, Type extends TSchema, InstantiatedArgument extends TSchema = TInstantiateType<Context, State, Type>> = TAssign<Context, { [_ in Name]: InstantiatedArgument }>;
type TBindArguments<Context extends TProperties, State extends TState, ParameterLeft extends TParameter, ParameterRight extends TParameter[], Arguments extends TSchema[], InstantiatedExtends extends TSchema = TInstantiateType<Context, State, ParameterLeft['extends']>, InstantiatedEquals extends TSchema = TInstantiateType<Context, State, ParameterLeft['equals']>> = (Arguments extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TBindParameters<TBindArgument<Context, State, ParameterLeft['name'], InstantiatedExtends, Left>, State, ParameterRight, Right> : TBindParameters<TBindArgument<Context, State, ParameterLeft['name'], InstantiatedExtends, InstantiatedEquals>, State, ParameterRight, []>);
type TBindParameters<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[]> = (Parameters extends [infer Left extends TParameter, ...infer Right extends TParameter[]] ? TBindArguments<Context, State, Left, Right, Arguments> : Context);
type TResolveArgumentsContext<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[], Result extends TProperties = TBindParameters<Context, State, Parameters, Arguments>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/call/instantiate.d.mts
type TPeek<State extends TState, Result extends string = (State['callstack'] extends [...infer _ extends string[], infer Top extends string] ? Top : '')> = Result;
type TIsTailCall<State extends TState, Name extends string, Result extends boolean = (TPeek<State> extends Name ? true : false)> = Result;
type TCallDispatch<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[], ArgumentsContext extends TProperties = TResolveArgumentsContext<Context, State, Parameters, Arguments>, ReturnType extends TSchema = TInstantiateType<ArgumentsContext, {
  callstack: [...State['callstack'], Target['$ref']];
}, Expression>> = TInstantiateType<Context, State, ReturnType>;
type TCallDistributed<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, DistributedArguments extends TSchema[][], Result extends TSchema[] = []> = (DistributedArguments extends [infer Arguments extends TSchema[], ...infer DistributedArguments extends TSchema[][]] ? TCallDispatch<Context, State, Target, Parameters, Expression, Arguments> extends infer ReturnType extends TSchema ? TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments, [...Result, ReturnType]> : never : Result);
type TCallImmediate<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, InstantiatedArguments extends TSchema[], DistributedArguments extends TSchema[][] = TDistributeArguments<Parameters, InstantiatedArguments, Expression>, ReturnTypes extends TSchema[] = TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments>, Result extends TSchema = (ReturnTypes['length'] extends 1 ? ReturnTypes[0] : TEvaluateUnion<ReturnTypes>)> = Result;
type TCallInstantiate<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[], InstantiatedArguments extends TSchema[] = TInstantiateTypes<Context, State, Arguments>, Resolved extends [string, TSchema] = TResolveTarget<Context, Target, Arguments>, Name extends string = Resolved[0], Type extends TSchema = Resolved[1], Result extends TSchema = (Type extends TGeneric<infer Parameters extends TParameter[], infer Expression extends TSchema> ? TIsTailCall<State, Name> extends true ? TCallConstruct<TRef<Name>, InstantiatedArguments> : TCallImmediate<Context, State, TRef<Name>, Parameters, Expression, InstantiatedArguments> : TCallConstruct<Target, InstantiatedArguments>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/types/call.d.mts
/** Represents a deferred generic Call */
interface TCall<Target extends TSchema = TSchema, Arguments extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Call';
  target: Target;
  arguments: Arguments;
}
type TCallConstruct<Target extends TSchema, Arguments extends TSchema[], Result extends TSchema = TCall<Target, Arguments>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/mapping.d.mts
interface TMappingType {
  input: string;
  output: string;
}
type TApplyMapping<Mapping extends TMappingType, Value extends string> = ((Mapping & {
  input: Value;
})['output']);
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/from_literal.d.mts
type TFromLiteral$2<Mapping extends TMappingType, Value extends TLiteralValue> = (Value extends string ? TLiteral<TApplyMapping<Mapping, Value>> : TLiteral<Value>);
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/from_template_literal.d.mts
type TFromTemplateLiteral$2<Mapping extends TMappingType, Pattern extends string, Decoded extends TSchema = TTemplateLiteralDecode<Pattern>, Result extends TSchema = TFromType$11<Mapping, Decoded>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/from_union.d.mts
type TFromUnion$6<Mapping extends TMappingType, Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$6<Mapping, Right, [...Result, TFromType$11<Mapping, Left>]> : TUnion<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/from_type.d.mts
type TFromType$11<Mapping extends TMappingType, Type extends TSchema> = (Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral$2<Mapping, Value> : Type extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral$2<Mapping, Pattern> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$6<Mapping, Types> : Type);
//#endregion
//#region node_modules/typebox/build/type/action/capitalize.d.mts
/** Creates a deferred Capitalize action. */
type TCapitalizeDeferred<Type extends TSchema> = (TDeferred<'Capitalize', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/action/lowercase.d.mts
/** Creates a deferred Lowercase action. */
type TLowercaseDeferred<Type extends TSchema> = (TDeferred<'Lowercase', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/action/uncapitalize.d.mts
/** Creates a deferred Uncapitalize action. */
type TUncapitalizeDeferred<Type extends TSchema> = (TDeferred<'Uncapitalize', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/action/uppercase.d.mts
/** Creates a deferred Uppercase action. */
type TUppercaseDeferred<Type extends TSchema> = (TDeferred<'Uppercase', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/intrinsics/instantiate.d.mts
interface TCapitalizeMapping extends TMappingType {
  output: Capitalize<this['input']>;
}
interface TLowercaseMapping extends TMappingType {
  output: Lowercase<this['input']>;
}
interface TUncapitalizeMapping extends TMappingType {
  output: Uncapitalize<this['input']>;
}
interface TUppercaseMapping extends TMappingType {
  output: Uppercase<this['input']>;
}
type TCapitalizeAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$11<TCapitalizeMapping, Type> : TCapitalizeDeferred<Type>)> = Result;
type TLowercaseAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$11<TLowercaseMapping, Type> : TLowercaseDeferred<Type>)> = Result;
type TUncapitalizeAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$11<TUncapitalizeMapping, Type> : TUncapitalizeDeferred<Type>)> = Result;
type TUppercaseAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$11<TUppercaseMapping, Type> : TUppercaseDeferred<Type>)> = Result;
type TCapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TCapitalizeAction<InstantiatedType>;
type TLowercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TLowercaseAction<InstantiatedType>;
type TUncapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TUncapitalizeAction<InstantiatedType>;
type TUppercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TUppercaseAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/conditional.d.mts
/** Creates a deferred Conditional action. */
type TConditionalDeferred<Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema> = (TDeferred<'Conditional', [Left, Right, True, False]>);
//#endregion
//#region node_modules/typebox/build/type/engine/conditional/instantiate.d.mts
type TConditionalOperation<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema, ExtendsResult extends ExtendsResult.TResult = TExtends<Context, Left, Right>> = (ExtendsResult extends ExtendsResult.TExtendsUnion<infer InferredContext extends TProperties> ? TUnion<[TInstantiateType<InferredContext, State, True>, TInstantiateType<Context, State, False>]> : ExtendsResult extends ExtendsResult.TExtendsTrue<infer InferredContext extends TProperties> ? TInstantiateType<InferredContext, State, True> : TInstantiateType<Context, State, False>);
type TConditionalAction<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema, Result extends TSchema = (TCanInstantiate<[Left, Right]> extends true ? TConditionalOperation<Context, State, Left, Right, True, False> : TConditionalDeferred<Left, Right, True, False>)> = Result;
type TConditionalInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema, InstaniatedLeft extends TSchema = TInstantiateType<Context, State, Left>, InstaniatedRight extends TSchema = TInstantiateType<Context, State, Right>> = TConditionalAction<Context, State, InstaniatedLeft, InstaniatedRight, True, False>;
//#endregion
//#region node_modules/typebox/build/type/action/constructor_parameters.d.mts
/** Creates a deferred ConstructorParameters action. */
type TConstructorParametersDeferred<Type extends TSchema> = (TDeferred<'ConstructorParameters', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/constructor_parameters/instantiate.d.mts
type TConstructorParametersOperation<Type extends TSchema, Parameters extends TSchema[] = (Type extends TConstructor ? Type['parameters'] : []), InstantiatedParameters extends TSchema[] = TInstantiateElements<{}, {
  callstack: [];
}, Parameters>, Result extends TSchema = TTuple<InstantiatedParameters>> = Result;
type TConstructorParametersAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TConstructorParametersOperation<Type> : TConstructorParametersDeferred<Type>)> = Result;
type TConstructorParametersInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TConstructorParametersAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/exclude.d.mts
/** Creates a deferred Exclude action. */
type TExcludeDeferred<Left extends TSchema, Right extends TSchema> = (TDeferred<'Exclude', [Left, Right]>);
//#endregion
//#region node_modules/typebox/build/type/engine/exclude/operation.d.mts
type TExcludeUnionLeft<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExcludeUnionLeft<Tail, Right, [...Result, ...TExcludeTypeLeft<Head, Right>]> : Result);
type TExcludeTypeLeft<Left extends TSchema, Right extends TSchema, Check extends TResult = TExtends<{}, Left, Right>, Result extends TSchema[] = (Check extends TExtendsTrueLike<infer _> ? [] : [Left])> = Result;
type TExcludeOperation<Left extends TSchema, Right extends TSchema, Remaining extends TSchema[] = (Left extends TEnum<infer Values extends TEnumValue[]> ? TExcludeUnionLeft<TEnumValuesToVariants<Values>, Right> : Left extends TUnion<infer Types extends TSchema[]> ? TExcludeUnionLeft<TFlatten<Types>, Right> : TExcludeTypeLeft<Left, Right>), Result extends TSchema = TEvaluateUnion<Remaining>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/exclude/instantiate.d.mts
type TExcludeAction<Left extends TSchema, Right extends TSchema, Result extends TSchema = (TCanInstantiate<[Left, Right]> extends true ? TExcludeOperation<Left, Right> : TExcludeDeferred<Left, Right>)> = Result;
type TExcludeInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, InstantiatedLeft extends TSchema = TInstantiateType<Context, State, Left>, InstantiatedRight extends TSchema = TInstantiateType<Context, State, Right>> = TExcludeAction<InstantiatedLeft, InstantiatedRight>;
//#endregion
//#region node_modules/typebox/build/type/action/extract.d.mts
/** Creates a deferred Extract action. */
type TExtractDeferred<Left extends TSchema, Right extends TSchema> = (TDeferred<'Extract', [Left, Right]>);
//#endregion
//#region node_modules/typebox/build/type/engine/extract/operation.d.mts
type TExtractUnionLeft<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]] ? TExtractUnionLeft<Tail, Right, [...Result, ...TExtractTypeLeft<Head, Right>]> : Result);
type TExtractTypeLeft<Left extends TSchema, Right extends TSchema, Check extends TResult = TExtends<{}, Left, Right>, Result extends TSchema[] = (Check extends TExtendsTrueLike<infer _> ? [Left] : [])> = Result;
type TExtractOperation<Left extends TSchema, Right extends TSchema, Remaining extends TSchema[] = (Left extends TEnum<infer Values extends TEnumValue[]> ? TExtractUnionLeft<TEnumValuesToVariants<Values>, Right> : Left extends TUnion<infer Types extends TSchema[]> ? TExtractUnionLeft<TFlatten<Types>, Right> : TExtractTypeLeft<Left, Right>), Result extends TSchema = TEvaluateUnion<Remaining>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/extract/instantiate.d.mts
type TExtractAction<Left extends TSchema, Right extends TSchema, Result extends TSchema = (TCanInstantiate<[Left, Right]> extends true ? TExtractOperation<Left, Right> : TExtractDeferred<Left, Right>)> = Result;
type TExtractInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, InstantiatedLeft extends TSchema = TInstantiateType<Context, State, Left>, InstantiatedRight extends TSchema = TInstantiateType<Context, State, Right>> = TExtractAction<InstantiatedLeft, InstantiatedRight>;
//#endregion
//#region node_modules/typebox/build/type/action/indexed.d.mts
/** Creates a deferred Index action. */
type TIndexDeferred<Type extends TSchema, Indexer extends TSchema> = (TDeferred<'Index', [Type, Indexer]>);
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_cyclic.d.mts
type TFromCyclic$4<Defs extends TProperties, Ref extends string, Target extends TSchema = TCyclicTarget<Defs, Ref>, Result extends TProperties = TFromType$10<Target>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_intersect.d.mts
type TCollapseIntersectProperties<Left extends TProperties, Right extends TProperties, LeftKeys extends keyof Left = Exclude<keyof Left, keyof Right>, RightKeys extends keyof Right = Exclude<keyof Right, keyof Left>, SharedKeys extends keyof Left & keyof Right = Extract<keyof Left, keyof Right>, LeftProperties extends TProperties = { [Key in LeftKeys]: Left[Key] }, RightProperties extends TProperties = { [Key in RightKeys]: Right[Key] }, SharedProperties extends TProperties = { [Key in SharedKeys]: TEvaluateIntersect<[Left[Key], Right[Key]]> }, Unique extends TProperties = TAssign<LeftProperties, RightProperties>, Shared extends TProperties = TAssign<Unique, SharedProperties>> = Shared;
type TFromIntersect$4<Types extends TSchema[], Result extends TProperties = {}> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromIntersect$4<Right, TCollapseIntersectProperties<Result, TFromType$10<Left>>> : { [Key in keyof Result]: Result[Key] });
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_object.d.mts
type TFromObject$5<Properties extends TProperties> = (Properties);
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_tuple.d.mts
type TFromTuple$3<Types extends TSchema[], Object extends TSchema = TTupleToObject<TTuple<Types>>, Result extends TSchema = TFromType$10<Object>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_union.d.mts
type TCollapseUnionProperties<Left extends TProperties, Right extends TProperties, SharedKeys extends PropertyKey = keyof Left & keyof Right, Result extends TProperties = { [Key in SharedKeys]: TEvaluateUnion<[Left[Key], Right[Key]]> }> = Result;
type TReduceVariants<Types extends TSchema[], Result extends TProperties> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TReduceVariants<Right, TCollapseUnionProperties<Result, TFromType$10<Left>>> : Result);
type TFromUnion$5<Types extends TSchema[]> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TReduceVariants<Right, TFromType$10<Left>> : TUnreachable);
//#endregion
//#region node_modules/typebox/build/type/engine/object/from_type.d.mts
type TFromType$10<Type extends TSchema, Result extends TProperties = (Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic$4<Defs, Ref> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect$4<Types> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$5<Types> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple$3<Types> : Type extends TObject<infer Properties extends TProperties> ? TFromObject$5<Properties> : {})> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/object/collapse.d.mts
type TCollapseToObject<Type extends TSchema, Properties extends TProperties = TFromType$10<Type>, Result extends TSchema = TObject<Properties>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/helpers/keys.d.mts
type TConvertToIntegerKey<Value extends TLiteralValue, Normal extends string = `${Value}`, Result extends TLiteralValue = (Normal extends ` ${infer _ extends number}` ? Normal : Normal extends `${infer _ extends number} ` ? Normal : Normal extends `0${infer _ extends number}` ? Normal : Normal extends `-${infer _ extends number}` ? Normal : Normal extends `${infer Value extends number}` ? Value : Value)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/from_array.d.mts
type TNormalizeLiteral<Value extends TLiteralValue, Result extends TSchema = TLiteral<TConvertToIntegerKey<Value>>> = Result;
type TNormalizeIndexerTypes<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TNormalizeIndexerTypes<Right, [...Result, TNormalizeIndexer<Left>]> : Result);
type TNormalizeIndexer<Type extends TSchema, Result extends TSchema = (Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TNormalizeIndexerTypes<Types>> : Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TNormalizeIndexerTypes<Types>> : Type extends TLiteral<infer Value extends TLiteralValue> ? TNormalizeLiteral<Value> : Type)> = Result;
type TFromArray$2<Type extends TSchema, Indexer extends TSchema, NormalizedIndexer extends TSchema = TNormalizeIndexer<Indexer>, Check extends TResult = TExtends<{}, NormalizedIndexer, TNumber>, Result extends TSchema = (Check extends TExtendsTrueLike ? Type : Indexer extends TLiteral<infer _ extends 'length'> ? TNumber : TNever)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_cyclic.d.mts
type TFromCyclic$3<Defs extends TProperties, Ref extends string, Target extends TSchema = TCyclicTarget<Defs, Ref>, Result extends string[] = TFromType$9<Target>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_union.d.mts
type TFromUnion$4<Types extends TSchema[], Result extends string[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$4<Right, [...Result, ...TFromType$9<Left>]> : Result);
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_enum.d.mts
type TFromEnum<Values extends TEnumValue[], Variants extends TSchema[] = TEnumValuesToVariants<Values>, Result extends string[] = TFromUnion$4<Variants>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_intersect.d.mts
type TFromIntersect$3<Types extends TSchema[], Evaluated extends TSchema = TEvaluateIntersect<Types>, Result extends string[] = TFromType$9<Evaluated>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_literal.d.mts
type TFromLiteral$1<Value extends TLiteralValue, Result extends string[] = [`${Value}`]> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_template_literal.d.mts
type TFromTemplateLiteral$1<Pattern extends string, Decoded extends TSchema = TTemplateLiteralDecode<Pattern>, Result extends string[] = TFromType$9<Decoded>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/from_type.d.mts
type TFromType$9<Indexer extends TSchema, Result extends string[] = (Indexer extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic$3<Defs, Ref> : Indexer extends TEnum<infer Values extends TEnumValue[]> ? TFromEnum<Values> : Indexer extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect$3<Types> : Indexer extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral$1<Value> : Indexer extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral$1<Pattern> : Indexer extends TUnion<infer Types extends TSchema[]> ? TFromUnion$4<Types> : [])> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/to_indexable_keys.d.mts
type TToIndexableKeys<Indexer extends TSchema, Result extends string[] = TFromType$9<Indexer>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/this/expand_this.d.mts
type TFromTypes<Properties extends TProperties, Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromTypes<Properties, Right, [...Result, TFromType$8<Properties, Left>]> : Result);
type TFromType$8<Properties extends TProperties, Type extends TSchema> = (Type extends TArray<infer Type extends TSchema> ? TArray<TFromType$8<Properties, Type>> : Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TFromType$8<Properties, Type>> : Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TConstructor<TFromTypes<Properties, Parameters>, TFromType$8<Properties, InstanceType>> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TFromTypes<Properties, Parameters>, TFromType$8<Properties, ReturnType>> : Type extends TIterator<infer Type extends TSchema> ? TIterator<TFromType$8<Properties, Type>> : Type extends TPromise<infer Type extends TSchema> ? TPromise<TFromType$8<Properties, Type>> : Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TFromTypes<Properties, Types>> : Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromTypes<Properties, Types>> : Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromTypes<Properties, Types>> : Type extends TThis ? TObject<Properties> : Type);
type TExpandThis<Properties extends TProperties, Type extends TSchema, Result extends TSchema = TFromType$8<Properties, Type>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/from_object.d.mts
type TIndexProperty<Properties extends TProperties, Key extends string, CanonicalKey extends string = (keyof Properties extends string | number ? `${keyof Properties}` : never), SelectedType extends TSchema = (Key extends CanonicalKey ? Properties[Key] : TNever), Result extends TSchema = TExpandThis<Properties, SelectedType>> = Result;
type TIndexProperties<Properties extends TProperties, Keys extends string[], Result extends TSchema[] = []> = (Keys extends [infer Left extends string, ...infer Right extends string[]] ? TIndexProperties<Properties, Right, [...Result, TIndexProperty<Properties, Left>]> : Result);
type TFromIndexer<Properties extends TProperties, Indexer extends TSchema, Keys extends string[] = TToIndexableKeys<Indexer>, Variants extends TSchema[] = TIndexProperties<Properties, Keys>, Result extends TSchema = TEvaluateUnion<Variants>> = Result;
type TNumericKeys<Keys extends string[], Result extends string[] = []> = (Keys extends [infer Left extends string, ...infer Right extends string[]] ? Left extends `${infer _ extends number}` ? TNumericKeys<Right, [...Result, Left]> : TNumericKeys<Right, Result> : Result);
type TFromIndexerNumber<Properties extends TProperties, Keys extends string[] = TPropertyKeys<Properties>, NumericKeys extends string[] = TNumericKeys<Keys>, Variants extends TSchema[] = TIndexProperties<Properties, NumericKeys>, Result extends TSchema = TEvaluateUnion<Variants>> = Result;
type TFromObject$4<Properties extends TProperties, Indexer extends TSchema, Result extends TSchema = (Indexer extends TNumber ? TFromIndexerNumber<Properties> : TFromIndexer<Properties, Indexer>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/array_indexer.d.mts
type TConvertLiteral<Value extends TLiteralValue, Result extends TSchema = TLiteral<TConvertToIntegerKey<Value>>> = Result;
type TArrayIndexerTypes<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TArrayIndexerTypes<Right, [...Result, TFormatArrayIndexer<Left>]> : Result);
/** Formats embedded integer-like strings on an Indexer to be number values inline with TS indexing | coercion behaviors. */
type TFormatArrayIndexer<Type extends TSchema, Result extends TSchema = (Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TArrayIndexerTypes<Types>> : Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TArrayIndexerTypes<Types>> : Type extends TLiteral<infer Value extends TLiteralValue> ? TConvertLiteral<Value> : Type)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/from_tuple.d.mts
type TIndexElementsWithIndexer<Types extends TSchema[], Indexer extends TSchema, Result extends TSchema[] = []> = (Types extends [...infer Left extends TSchema[], infer Right extends TSchema] ? TExtends<{}, TLiteral<Left['length']>, Indexer> extends TExtendsTrueLike ? TIndexElementsWithIndexer<Left, Indexer, [Right, ...Result]> : TIndexElementsWithIndexer<Left, Indexer, Result> : Result);
type TFromTupleWithIndexer<Types extends TSchema[], Indexer extends TSchema, ArrayIndexer extends TSchema = TFormatArrayIndexer<Indexer>, Elements extends TSchema[] = TIndexElementsWithIndexer<Types, ArrayIndexer>, Result extends TSchema = TEvaluateUnionFast<Elements>> = Result;
type TFromTupleWithoutIndexer<Types extends TSchema[], Result extends TSchema = TEvaluateUnionFast<Types>> = Result;
type TFromTuple$2<Types extends TSchema[], Indexer extends TSchema, Result extends TSchema = (Indexer extends TLiteral<infer _ extends 'length'> ? TLiteral<Types['length']> : Indexer extends TNumber | TInteger ? TFromTupleWithoutIndexer<Types> : TFromTupleWithIndexer<Types, Indexer>)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/from_type.d.mts
type TFromType$7<Type extends TSchema, Indexer extends TSchema> = (Type extends TArray<infer Type extends TSchema> ? TFromArray$2<Type, Indexer> : Type extends TObject<infer Properties extends TProperties> ? TFromObject$4<Properties, Indexer> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple$2<Types, Indexer> : TNever);
//#endregion
//#region node_modules/typebox/build/type/engine/indexed/instantiate.d.mts
type TNormalizeType$1<Type extends TSchema, Result extends TSchema = (Type extends TCyclic | TIntersect | TUnion ? TCollapseToObject<Type> : Type)> = Result;
type TIndexAction<Type extends TSchema, Indexer extends TSchema, Result extends TSchema = (TCanInstantiate<[Type, Indexer]> extends true ? TFromType$7<TNormalizeType$1<Type>, Indexer> : TIndexDeferred<Type, Indexer>)> = Result;
type TIndexInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>, InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>> = TIndexAction<InstantiatedType, InstantiatedIndexer>;
//#endregion
//#region node_modules/typebox/build/type/action/instance_type.d.mts
/** Creates a deferred InstanceType action. */
type TInstanceTypeDeferred<Type extends TSchema> = (TDeferred<'InstanceType', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/instance_type/instantiate.d.mts
type TInstanceTypeOperation<Type extends TSchema> = (Type extends TConstructor ? Type['instanceType'] : TNever);
type TInstanceTypeAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TInstanceTypeOperation<Type> : TInstanceTypeDeferred<Type>)> = Result;
type TInstanceTypeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TInstanceTypeAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/keyof.d.mts
/** Creates a deferred KeyOf action. */
type TKeyOfDeferred<Type extends TSchema> = (TDeferred<'KeyOf', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_any.d.mts
type TFromAny<Result = TUnion<[TNumber, TString, TSymbol]>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_array.d.mts
type TFromArray$1<_Type extends TSchema> = TNumber;
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_object.d.mts
type TFromPropertyKeys<Keys extends PropertyKey[], Result extends TSchema[] = []> = (Keys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]] ? Left extends TLiteralValue ? TFromPropertyKeys<Right, [...Result, TLiteral<Left>]> : TUnreachable : Result);
type TFromObject$3<Properties extends TProperties, PropertyKeys extends PropertyKey[] = TUnionToTuple<keyof Properties>, Variants extends TSchema[] = TFromPropertyKeys<PropertyKeys>, Result extends TSchema = TEvaluateUnionFast<Variants>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_record.d.mts
type TFromRecord<Type extends TRecord, Result extends TSchema = TRecordKey<Type>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_tuple.d.mts
type TFromTuple$1<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [...infer Left extends TSchema[], infer _ extends TSchema] ? TFromTuple$1<Left, [TLiteral<Left['length']>, ...Result]> : TEvaluateUnionFast<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/from_type.d.mts
type TFromType$6<Type extends TSchema> = (Type extends TAny ? TFromAny : Type extends TArray<infer Type extends TSchema> ? TFromArray$1<Type> : Type extends TObject<infer Properties extends TProperties> ? TFromObject$3<Properties> : Type extends TRecord ? TFromRecord<Type> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple$1<Types> : TNever);
//#endregion
//#region node_modules/typebox/build/type/engine/keyof/instantiate.d.mts
type TNormalizeType<Type extends TSchema, Result extends TSchema = (Type extends TCyclic | TIntersect | TUnion ? TCollapseToObject<Type> : Type)> = Result;
type TKeyOfAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$6<TNormalizeType<Type>> : TKeyOfDeferred<Type>)> = Result;
type TKeyOfInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TKeyOfAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/mapped.d.mts
/** Creates a deferred Mapped action. */
type TMappedDeferred<Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema> = (TDeferred<'Mapped', [Identifier, Type, As, Property]>);
//#endregion
//#region node_modules/typebox/build/type/engine/mapped/mapped_variants.d.mts
type TFromTemplateLiteral<Pattern extends string, Decoded extends TSchema = TTemplateLiteralDecode<Pattern>, Result extends TSchema[] = TFromType$5<Decoded>> = Result;
type TFromUnion$3<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$3<Right, [...Result, ...TFromType$5<Left>]> : Result);
type TFromLiteral<Value extends TLiteralValue, Result extends TSchema[] = (Value extends number ? [TLiteral<`${Value}`>] : [TLiteral<Value>])> = Result;
type TFromType$5<Type extends TSchema, Result extends TSchema[] = (Type extends TEnum<infer Values extends TEnumValue[]> ? TFromUnion$3<TEnumValuesToVariants<Values>> : Type extends TLiteral<infer Value extends number> ? TFromLiteral<Value> : Type extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral<Pattern> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$3<Types> : [Type])> = Result;
type TMappedVariants<Type extends TSchema, Result extends TSchema[] = TFromType$5<Type>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/mapped/mapped_operation.d.mts
type TCanonicalAs<InstantiatedAs extends TSchema, Result extends TSchema = (InstantiatedAs extends TTemplateLiteral<infer Pattern extends string> ? TTemplateLiteralDecode<Pattern> : InstantiatedAs)> = Result;
type TMappedVariant<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variant extends TSchema, As extends TSchema, Property extends TSchema, VariantContext extends TProperties = TAssign<Context, { [_ in Identifier['name']]: Variant }>, InstantiatedAs extends TSchema = TInstantiateType<VariantContext, State, As>, CanonicalAs extends TSchema = TCanonicalAs<InstantiatedAs>, InstantiatedProperty extends TSchema = TInstantiateType<VariantContext, State, Property>, Result extends TProperties = (CanonicalAs extends TLiteral<string | number> ? { [_ in CanonicalAs['const']]: InstantiatedProperty } : {})> = Result;
type TMappedProperties<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variants extends TSchema[], As extends TSchema, Property extends TSchema, Result extends TProperties[] = []> = (Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TMappedProperties<Context, State, Identifier, Right, As, Property, [...Result, TMappedVariant<Context, State, Identifier, Left, As, Property>]> : Result);
type TReduceProperties<Properties extends TProperties[], Result extends TSchema[] = []> = (Properties extends [infer Left extends TProperties, ...infer Right extends TProperties[]] ? TReduceProperties<Right, [...Result, TObject<Left>]> : Result);
type TMappedOperation<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema, Variants extends TSchema[] = TMappedVariants<Type>, MappedProperties extends TProperties[] = TMappedProperties<Context, State, Identifier, Variants, As, Property>, MappedObjects extends TSchema[] = TReduceProperties<MappedProperties>, Result extends TSchema = TEvaluateIntersect<MappedObjects>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/mapped/instantiate.d.mts
type TMappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TMappedOperation<Context, State, Identifier, Type, As, Property> : TMappedDeferred<Identifier, Type, As, Property>)> = Result;
type TMappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema, InstaniatedType extends TSchema = TInstantiateType<Context, State, Type>> = TMappedAction<Context, State, Identifier, InstaniatedType, As, Property>;
//#endregion
//#region node_modules/typebox/build/type/engine/module/instantiate.d.mts
type TInstantiateCyclics<Context extends TProperties, CyclicKeys extends string[], Result extends TProperties = { [Key in Extract<keyof Context, CyclicKeys[number]>]: TInstantiateCyclic<Context, Key, Context[Key]> }> = Result;
type TInstantiateNonCyclics<Context extends TProperties, CyclicKeys extends string[], Result extends TProperties = { [Key in Exclude<keyof Context, CyclicKeys[number]>]: TInstantiateType<Context, {
  callstack: [];
}, Context[Key]> }> = Result;
type TInstantiateModule<Context extends TProperties, CyclicCandidates extends string[] = TCyclicCandidates<Context>, InstantiatedCyclics extends TProperties = TInstantiateCyclics<Context, CyclicCandidates>, InstantiatedNonCyclics extends TProperties = TInstantiateNonCyclics<Context, CyclicCandidates>, InstantiatedModule extends TProperties = InstantiatedCyclics & InstantiatedNonCyclics> = { [Key in keyof InstantiatedModule]: InstantiatedModule[Key] } & {};
type TModuleInstantiate<Context extends TProperties, _State extends TState, Properties extends TProperties, ModuleContext extends TProperties = TAssign<Context, Properties>, InstantiatedModule extends TProperties = TInstantiateModule<ModuleContext>> = InstantiatedModule;
//#endregion
//#region node_modules/typebox/build/type/action/non_nullable.d.mts
/** Creates a deferred NonNullable action. */
type TNonNullableDeferred<Type extends TSchema> = (TDeferred<'NonNullable', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/non_nullable/instantiate.d.mts
type TNonNullableOperation<Type extends TSchema, Excluded extends TSchema = TUnion<[TNull, TUndefined]>> = TExcludeAction<Type, Excluded>;
type TNonNullableAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TNonNullableOperation<Type> : TNonNullableDeferred<Type>)> = Result;
type TNonNullableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TNonNullableAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/omit.d.mts
/** Creates a deferred Omit action. */
type TOmitDeferred<Type extends TSchema, Indexer extends TSchema> = (TDeferred<'Omit', [Type, Indexer]>);
//#endregion
//#region node_modules/typebox/build/type/engine/indexable/to_indexable.d.mts
/** Transforms a type into a TProperties used for indexing operations */
type TToIndexable<Type extends TSchema, Collapsed extends TSchema = TCollapseToObject<Type>, Result extends TProperties = (Collapsed extends TObject<infer Properties extends TProperties> ? Properties : TUnreachable)> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/omit/from_type.d.mts
type TNormalKeys<Keys extends string[], UnionKeys extends string = Keys[number], Result extends string | number = (UnionKeys extends `${infer Value extends number}` ? UnionKeys | Value : UnionKeys)> = Result;
type TFromKeys$1<Properties extends TProperties, Keys extends string[], Omitted extends TProperties = Omit<Properties, TNormalKeys<Keys>>, Result extends TProperties = { [Key in keyof Omitted]: Omitted[Key] }> = Result;
type TFromType$4<Type extends TSchema, Indexer extends TSchema, Indexable extends TProperties = TToIndexable<Type>, IndexableKeys extends string[] = TToIndexableKeys<Indexer>, Omitted extends TProperties = TFromKeys$1<Indexable, IndexableKeys>, Result extends TSchema = TObject<Omitted>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/omit/instantiate.d.mts
type TOmitAction<Type extends TSchema, Indexer extends TSchema, Result extends TSchema = (TCanInstantiate<[Type, Indexer]> extends true ? TFromType$4<Type, Indexer> : TOmitDeferred<Type, Indexer>)> = Result;
type TOmitInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>, InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>> = TOmitAction<InstantiatedType, InstantiatedIndexer>;
//#endregion
//#region node_modules/typebox/build/type/action/options.d.mts
/** Creates a deferred Options action. */
type TOptionsDeferred<Type extends TSchema, Options extends TSchema> = (TDeferred<'Options', [Type, Options]>);
/** Applies an immediate Options action to the given type. */
type TOptions<Type extends TSchema, Options extends TSchema> = (Type & Options);
//#endregion
//#region node_modules/typebox/build/type/engine/options/instantiate.d.mts
type TOptionsAction<Type extends TSchema, Options extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TOptions<Type, Options> : TOptionsDeferred<Type, Options>)> = Result;
type TOptionsInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Options extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TOptionsAction<InstantiatedType, Options>;
//#endregion
//#region node_modules/typebox/build/type/action/parameters.d.mts
/** Creates a deferred Parameters action. */
type TParametersDeferred<Type extends TSchema> = (TDeferred<'Parameters', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/parameters/instantiate.d.mts
type TParametersOperation<Type extends TSchema, Parameters extends TSchema[] = (Type extends TFunction ? Type['parameters'] : []), InstantiatedParameters extends TSchema[] = TInstantiateElements<{}, {
  callstack: [];
}, Parameters>, Result extends TSchema = TTuple<InstantiatedParameters>> = Result;
type TParametersAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TParametersOperation<Type> : TParametersDeferred<Type>)> = Result;
type TParametersInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TParametersAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/partial.d.mts
/** Creates a deferred Partial action. */
type TPartialDeferred<Type extends TSchema> = (TDeferred<'Partial', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/partial/from_cyclic.d.mts
type TFromCyclic$2<Defs extends TProperties, Ref extends string, Target extends TSchema = TCyclicTarget<Defs, Ref>, Partial extends TSchema = TFromType$3<Target>, Result extends TSchema = TCyclic<TAssign<Defs, { [_ in Ref]: Partial }>, Ref>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/partial/from_intersect.d.mts
type TFromIntersect$2<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromIntersect$2<Right, [...Result, TFromType$3<Left>]> : TEvaluateIntersect<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/partial/from_union.d.mts
type TFromUnion$2<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$2<Right, [...Result, TFromType$3<Left>]> : TUnion<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/partial/from_object.d.mts
type TFromObject$2<Properties extends TProperties, Mapped extends TProperties = { [Key in keyof Properties]: TOptionalAdd<Properties[Key]> }, Result extends TSchema = TObject<Mapped>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/partial/from_type.d.mts
type TFromType$3<Type extends TSchema> = (Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic$2<Defs, Ref> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect$2<Types> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$2<Types> : Type extends TObject<infer Properties extends TProperties> ? TFromObject$2<Properties> : TObject<{}>);
//#endregion
//#region node_modules/typebox/build/type/engine/partial/instantiate.d.mts
type TPartialAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$3<Type> : TPartialDeferred<Type>)> = Result;
type TPartialInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TPartialAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/pick.d.mts
/** Creates a deferred Pick action. */
type TPickDeferred<Type extends TSchema, Indexer extends TSchema> = (TDeferred<'Pick', [Type, Indexer]>);
//#endregion
//#region node_modules/typebox/build/type/engine/pick/from_type.d.mts
type TComparable<Indexable extends TProperties> = (keyof Indexable extends string | number ? `${keyof Indexable}` : never);
type TFromKeys<Indexable extends TProperties, Keys extends string[], Result extends TProperties = {}> = (Keys extends [infer Left extends string, ...infer Right extends string[]] ? Left extends TComparable<Indexable> ? TFromKeys<Indexable, Right, TAssign<Result, { [_ in Left]: Indexable[Left] }>> : TFromKeys<Indexable, Right, Result> : Result);
type TFromType$2<Type extends TSchema, Indexer extends TSchema, Indexable extends TProperties = TToIndexable<Type>, Keys extends string[] = TToIndexableKeys<Indexer>, Applied extends TProperties = TFromKeys<Indexable, Keys>, Result extends TSchema = TObject<Applied>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/pick/instantiate.d.mts
type TPickAction<Type extends TSchema, Indexer extends TSchema, Result extends TSchema = (TCanInstantiate<[Type, Indexer]> extends true ? TFromType$2<Type, Indexer> : TPickDeferred<Type, Indexer>)> = Result;
type TPickInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>, InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>> = TPickAction<InstantiatedType, InstantiatedIndexer>;
//#endregion
//#region node_modules/typebox/build/type/action/readonly_object.d.mts
/** Creates a deferred ReadonlyType action. */
type TReadonlyObjectDeferred<Type extends TSchema> = (TDeferred<'ReadonlyObject', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_array.d.mts
type TFromArray<Type extends TSchema, Result extends TSchema = TImmutableAdd<TArray<Type>>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_cyclic.d.mts
type TFromCyclic$1<Defs extends TProperties, Ref extends string, Target extends TSchema = TCyclicTarget<Defs, Ref>, Partial extends TSchema = TFromType$1<Target>, Result extends TSchema = TCyclic<TAssign<Defs, { [_ in Ref]: Partial }>, Ref>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_intersect.d.mts
type TFromIntersect$1<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromIntersect$1<Right, [...Result, TFromType$1<Left>]> : TEvaluateIntersect<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_object.d.mts
type TFromObject$1<Properties extends TProperties, Mapped extends TProperties = { [Key in keyof Properties]: TReadonlyAdd<Properties[Key]> }, Result extends TSchema = TObject<Mapped>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_tuple.d.mts
type TFromTuple<Types extends TSchema[], Result extends TSchema = TImmutableAdd<TTuple<Types>>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_union.d.mts
type TFromUnion$1<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion$1<Right, [...Result, TFromType$1<Left>]> : TUnion<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/from_type.d.mts
type TFromType$1<Type extends TSchema> = (Type extends TArray<infer Type extends TSchema> ? TFromArray<Type> : Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic$1<Defs, Ref> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect$1<Types> : Type extends TObject<infer Properties extends TProperties> ? TFromObject$1<Properties> : Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion$1<Types> : Type);
//#endregion
//#region node_modules/typebox/build/type/engine/readonly_object/instantiate.d.mts
type TReadonlyObjectAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType$1<Type> : TReadonlyObjectDeferred<Type>)> = Result;
type TReadonlyObjectInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiateType extends TSchema = TInstantiateType<Context, State, Type>> = TReadonlyObjectAction<InstantiateType>;
//#endregion
//#region node_modules/typebox/build/type/engine/ref/instantiate.d.mts
type TRefInstantiate<Context extends TProperties, State extends TState, Type extends TRef, Ref extends string> = (Ref extends keyof Context ? TCyclicCheck<[Ref], Context, Context[Ref]> extends true ? Type : TInstantiateType<Context, State, Context[Ref]> : Type);
//#endregion
//#region node_modules/typebox/build/type/engine/required/from_cyclic.d.mts
type TFromCyclic<Defs extends TProperties, Ref extends string, Target extends TSchema = TCyclicTarget<Defs, Ref>, Partial extends TSchema = TFromType<Target>, Result extends TSchema = TCyclic<TAssign<Defs, { [_ in Ref]: Partial }>, Ref>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/required/from_intersect.d.mts
type TFromIntersect<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromIntersect<Right, [...Result, TFromType<Left>]> : TEvaluateIntersect<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/required/from_union.d.mts
type TFromUnion<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TFromUnion<Right, [...Result, TFromType<Left>]> : TUnion<Result>);
//#endregion
//#region node_modules/typebox/build/type/engine/required/from_object.d.mts
type TFromObject<Properties extends TProperties, Mapped extends TProperties = { [Key in keyof Properties]: TOptionalRemove<Properties[Key]> }, Result extends TSchema = TObject<Mapped>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/required/from_type.d.mts
type TFromType<Type extends TSchema> = (Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic<Defs, Ref> : Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Types> : Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> : Type extends TObject<infer Properties extends TProperties> ? TFromObject<Properties> : TObject<{}>);
//#endregion
//#region node_modules/typebox/build/type/action/required.d.mts
/** Creates a deferred Required action. */
type TRequiredDeferred<Type extends TSchema> = (TDeferred<'Required', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/required/instantiate.d.mts
type TRequiredAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TFromType<Type> : TRequiredDeferred<Type>)> = Result;
type TRequiredInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TRequiredAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/action/return_type.d.mts
/** Creates a deferred ReturnType action. */
type TReturnTypeDeferred<Type extends TSchema> = (TDeferred<'ReturnType', [Type]>);
//#endregion
//#region node_modules/typebox/build/type/engine/return_type/instantiate.d.mts
type TReturnTypeOperation<Type extends TSchema> = (Type extends TFunction ? Type['returnType'] : TNever);
type TReturnTypeAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TReturnTypeOperation<Type> : TReturnTypeDeferred<Type>)> = Result;
type TReturnTypeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>> = TReturnTypeAction<InstantiatedType>;
//#endregion
//#region node_modules/typebox/build/type/engine/rest/spread.d.mts
type TSpreadElement<Type extends TSchema, Result extends TSchema[] = (Type extends TRest<infer Rest extends TSchema> ? (Rest extends TTuple<infer Elements extends TSchema[]> ? TRestSpread<Elements> : Rest extends TInfer<string, TSchema> ? [Type] : Rest extends TRef<string> ? [Type] : [TNever]) : [Type])> = Result;
type TRestSpread<Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TRestSpread<Right, [...Result, ...TSpreadElement<Left>]> : Result);
//#endregion
//#region node_modules/typebox/build/type/engine/instantiate.d.mts
interface TState {
  callstack: string[];
}
type TCanInstantiate<Types extends TSchema[]> = Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? Left extends TRef ? false : TCanInstantiate<Right> : true;
type ModifierAction = 'add' | 'remove' | 'none';
type TModifierActions<Type extends TSchema, Readonly extends ModifierAction, Optional extends ModifierAction> = (Type extends TReadonlyRemoveAction<infer Type extends TSchema> ? TModifierActions<Type, 'remove', Optional> : Type extends TOptionalRemoveAction<infer Type extends TSchema> ? TModifierActions<Type, Readonly, 'remove'> : Type extends TReadonlyAddAction<infer Type extends TSchema> ? TModifierActions<Type, 'add', Optional> : Type extends TOptionalAddAction<infer Type extends TSchema> ? TModifierActions<Type, Readonly, 'add'> : [Type, Readonly, Optional]);
type TApplyReadonly<Action extends ModifierAction, Type extends TSchema> = (Action extends 'remove' ? TReadonlyRemove<Type> : Action extends 'add' ? TReadonlyAdd<Type> : Type);
type TApplyOptional<Action extends ModifierAction, Type extends TSchema> = (Action extends 'remove' ? TOptionalRemove<Type> : Action extends 'add' ? TOptionalAdd<Type> : Type);
type TInstantiateProperties<Context extends TProperties, State extends TState, Properties extends TProperties, Result extends TProperties = { [Key in keyof Properties]: TInstantiateType<Context, State, Properties[Key]> }> = Result;
type TInstantiateElements<Context extends TProperties, State extends TState, Types extends TSchema[], Elements extends TSchema[] = TInstantiateTypes<Context, State, Types>, Result extends TSchema[] = TRestSpread<Elements>> = Result;
type TInstantiateTypes<Context extends TProperties, State extends TState, Types extends TSchema[], Result extends TSchema[] = []> = (Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? TInstantiateTypes<Context, State, Right, [...Result, TInstantiateType<Context, State, Left>]> : Result);
type TInstantiateDeferred<Context extends TProperties, State extends TState, Action extends string, Parameters extends TSchema[]> = ([Action, Parameters] extends ['Awaited', [infer Type extends TSchema]] ? TAwaitedInstantiate<Context, State, Type> : [Action, Parameters] extends ['Capitalize', [infer Type extends TSchema]] ? TCapitalizeInstantiate<Context, State, Type> : [Action, Parameters] extends ['Conditional', [infer Left extends TSchema, infer Right extends TSchema, infer True extends TSchema, infer False extends TSchema]] ? TConditionalInstantiate<Context, State, Left, Right, True, False> : [Action, Parameters] extends ['ConstructorParameters', [infer Type extends TSchema]] ? TConstructorParametersInstantiate<Context, State, Type> : [Action, Parameters] extends ['Evaluate', [infer Type extends TSchema]] ? TEvaluateInstantiate<Context, State, Type> : [Action, Parameters] extends ['Exclude', [infer Left extends TSchema, infer Right extends TSchema]] ? TExcludeInstantiate<Context, State, Left, Right> : [Action, Parameters] extends ['Extract', [infer Left extends TSchema, infer Right extends TSchema]] ? TExtractInstantiate<Context, State, Left, Right> : [Action, Parameters] extends ['Index', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TIndexInstantiate<Context, State, Type, Indexer> : [Action, Parameters] extends ['InstanceType', [infer Type extends TSchema]] ? TInstanceTypeInstantiate<Context, State, Type> : [Action, Parameters] extends ['Interface', [infer Heritage extends TSchema[], infer Properties extends TProperties]] ? TInterfaceInstantiate<Context, State, Heritage, Properties> : [Action, Parameters] extends ['KeyOf', [infer Type extends TSchema]] ? TKeyOfInstantiate<Context, State, Type> : [Action, Parameters] extends ['Lowercase', [infer Type extends TSchema]] ? TLowercaseInstantiate<Context, State, Type> : [Action, Parameters] extends ['Mapped', [infer Name extends TIdentifier, infer Key extends TSchema, infer As extends TSchema, infer Property extends TSchema]] ? TMappedInstantiate<Context, State, Name, Key, As, Property> : [Action, Parameters] extends ['Module', [infer Properties extends TProperties]] ? TModuleInstantiate<Context, State, Properties> : [Action, Parameters] extends ['NonNullable', [infer Type extends TSchema]] ? TNonNullableInstantiate<Context, State, Type> : [Action, Parameters] extends ['Pick', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TPickInstantiate<Context, State, Type, Indexer> : [Action, Parameters] extends ['Options', [infer Type extends TSchema, infer Options extends TSchema]] ? TOptionsInstantiate<Context, State, Type, Options> : [Action, Parameters] extends ['Parameters', [infer Type extends TSchema]] ? TParametersInstantiate<Context, State, Type> : [Action, Parameters] extends ['Partial', [infer Type extends TSchema]] ? TPartialInstantiate<Context, State, Type> : [Action, Parameters] extends ['Omit', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TOmitInstantiate<Context, State, Type, Indexer> : [Action, Parameters] extends ['ReadonlyObject', [infer Type extends TSchema]] ? TReadonlyObjectInstantiate<Context, State, Type> : [Action, Parameters] extends ['Record', [infer Key extends TSchema, infer Value extends TSchema]] ? TRecordInstantiate<Context, State, Key, Value> : [Action, Parameters] extends ['Required', [infer Type extends TSchema]] ? TRequiredInstantiate<Context, State, Type> : [Action, Parameters] extends ['ReturnType', [infer Type extends TSchema]] ? TReturnTypeInstantiate<Context, State, Type> : [Action, Parameters] extends ['TemplateLiteral', [infer Types extends TSchema[]]] ? TTemplateLiteralInstantiate<Context, State, Types> : [Action, Parameters] extends ['Uncapitalize', [infer Type extends TSchema]] ? TUncapitalizeInstantiate<Context, State, Type> : [Action, Parameters] extends ['Uppercase', [infer Type extends TSchema]] ? TUppercaseInstantiate<Context, State, Type> : TDeferred<Action, Parameters>);
type TInstantiateType<Context extends TProperties, State extends TState, Input extends TSchema, Immutable extends boolean = (Input extends TImmutable ? true : false), Modifiers extends [TSchema, ModifierAction, ModifierAction] = TModifierActions<Input, Input extends TReadonly<Input> ? 'add' : 'none', Input extends TOptional<Input> ? 'add' : 'none'>, Type extends TSchema = Modifiers[0], Instantiated extends TSchema = (Type extends TRef<infer Ref extends string> ? TRefInstantiate<Context, State, Type, Ref> : Type extends TArray<infer Type extends TSchema> ? TArray<TInstantiateType<Context, State, Type>> : Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TInstantiateType<Context, State, Type>> : Type extends TCall<infer Target extends TSchema, infer Parameters extends TSchema[]> ? TCallInstantiate<Context, State, Target, Parameters> : Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TConstructor<TInstantiateTypes<Context, State, Parameters>, TInstantiateType<Context, State, InstanceType>> : Type extends TDeferred<infer Action extends string, infer Types extends TSchema[]> ? TInstantiateDeferred<Context, State, Action, Types> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TInstantiateTypes<Context, State, Parameters>, TInstantiateType<Context, State, ReturnType>> : Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TInstantiateTypes<Context, State, Types>> : Type extends TIterator<infer Type extends TSchema> ? TIterator<TInstantiateType<Context, State, Type>> : Type extends TObject<infer Properties extends TProperties> ? TObject<TInstantiateProperties<Context, State, Properties>> : Type extends TPromise<infer Type extends TSchema> ? TPromise<TInstantiateType<Context, State, Type>> : Type extends TRecord<infer Key extends string, infer Type extends TSchema> ? TRecord<Key, TInstantiateType<Context, State, Type>> : Type extends TRest<infer Type extends TSchema> ? TRest<TInstantiateType<Context, State, Type>> : Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TInstantiateElements<Context, State, Types>> : Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TInstantiateTypes<Context, State, Types>> : Type), WithImmutable extends TSchema = (Immutable extends true ? TImmutable<Instantiated> : Instantiated), WithModifiers extends TSchema = TApplyReadonly<Modifiers[1], TApplyOptional<Modifiers[2], WithImmutable>>> = WithModifiers;
/** Instantiates computed schematics using the given context and type. */
type TInstantiate<Context extends TProperties, Type extends TSchema> = (TInstantiateType<Context, {
  callstack: [];
}, Type>);
//#endregion
//#region node_modules/typebox/build/type/types/function.d.mts
type StaticInstantiatedParameters<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], Evaluated extends TSchema = TInstantiate<Context, TTuple<Parameters>>, Static extends unknown = StaticType<Stack, Direction, Context, This, Evaluated>, Result extends unknown[] = (Static extends unknown[] ? Static : [])> = Result;
type StaticFunction<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema, StaticParameters extends unknown[] = StaticInstantiatedParameters<Stack, Direction, Context, This, Parameters>, StaticReturnType extends unknown = StaticType<Stack, Direction, Context, This, ReturnType>, Result = (...args: StaticParameters) => StaticReturnType> = Result;
/** Represents a Function type. */
interface TFunction<Parameters extends TSchema[] = TSchema[], ReturnType extends TSchema = TSchema> extends TSchema {
  '~kind': 'Function';
  type: 'function';
  parameters: Parameters;
  returnType: ReturnType;
}
//#endregion
//#region node_modules/typebox/build/type/types/constructor.d.mts
type StaticConstructor<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema, StaticParameters extends unknown[] = StaticInstantiatedParameters<Stack, Direction, Context, This, Parameters>, StaticReturnType extends unknown = StaticType<Stack, Direction, Context, This, InstanceType>, Result = new (...args: StaticParameters) => StaticReturnType> = Result;
/** Represents a Constructor type. */
interface TConstructor<Parameters extends TSchema[] = TSchema[], InstanceType extends TSchema = TSchema> extends TSchema {
  '~kind': 'Constructor';
  type: 'constructor';
  parameters: Parameters;
  instanceType: InstanceType;
}
//#endregion
//#region node_modules/typebox/build/schema/static/_canonical.d.mts
type XCanonicalTuple<Value extends readonly unknown[]> = (Value extends [infer Left, ...infer Right extends unknown[]] ? [XCanonical<Left>, ...XCanonicalTuple<Right>] : []);
type XCanonicalArray<Value extends unknown, Result extends unknown[] = XCanonical<Value>[]> = Result;
type XCanonicalObject<Value extends object, Result extends Record<PropertyKey, unknown> = { -readonly [Key in keyof Value]: XCanonical<Value[Key]> }> = Result;
type XCanonical<Schema extends unknown> = (Schema extends readonly [...infer Schemas extends unknown[]] ? XCanonicalTuple<Schemas> : Schema extends readonly (infer Schema)[] ? XCanonicalArray<Schema> : Schema extends object ? XCanonicalObject<Schema> : Schema);
//#endregion
//#region node_modules/typebox/build/schema/static/additionalProperties.d.mts
type XStaticAdditionalProperties<Stack extends string[], Root extends XSchema, Schema extends XSchema, Result extends Record<PropertyKey, unknown> = (Schema extends true ? {
  [key: string]: unknown;
} : Schema extends false ? {} : {
  [key: string]: XStaticSchema<Stack, Root, Schema>;
})> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/allOf.d.mts
type XStaticAllOf<Stack extends string[], Root extends XSchema, Schemas extends XSchema[], Result extends unknown = unknown> = (Schemas extends readonly [infer Left extends XSchema, ...infer Right extends XSchema[]] ? XStaticAllOf<Stack, Root, Right, Result & XStaticSchema<Stack, Root, Left>> : Result);
//#endregion
//#region node_modules/typebox/build/schema/static/anyOf.d.mts
type XStaticAnyOf<Stack extends string[], Root extends XSchema, Schemas extends XSchema[], Result extends unknown = never> = (Schemas extends [infer Left extends XSchema, ...infer Right extends XSchema[]] ? XStaticAnyOf<Stack, Root, Right, XStaticSchema<Stack, Root, Left> | Result> : Result);
//#endregion
//#region node_modules/typebox/build/schema/static/const.d.mts
type XStaticConst<Value extends unknown> = Value;
//#endregion
//#region node_modules/typebox/build/schema/static/enum.d.mts
type XStaticEnum<Values extends unknown[], Result extends unknown = never> = (Values extends [infer Left extends unknown, ...infer Right extends unknown[]] ? XStaticEnum<Right, Left | Result> : Result);
//#endregion
//#region node_modules/typebox/build/schema/static/if.d.mts
type XStaticIf<Stack extends string[], Root extends XSchema, Schema extends XIf, IfSchema extends XSchema, If extends unknown = XStaticSchema<Stack, Root, IfSchema>, Then extends unknown = (Schema extends XThen<infer ThenSchema extends XSchema> ? XStaticSchema<Stack, Root, ThenSchema> : never), Else extends unknown = (Schema extends XElse<infer ElseSchema extends XSchema> ? XStaticSchema<Stack, Root, ElseSchema> : never), IsThen extends boolean = (Schema extends XThen ? true : false), IsElse extends boolean = (Schema extends XElse ? true : false), Result extends unknown = ([IsThen, IsElse] extends [true, true] ? (If & Then) | Exclude<Else, If> : [IsThen, IsElse] extends [true, false] ? (If & Then) : [IsThen, IsElse] extends [false, true] ? Exclude<Else, If> : unknown)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/_comparer.d.mts
type XBuildTuple<Size extends number, Tuple extends unknown[] = []> = (Tuple['length'] extends Size ? Tuple : XBuildTuple<Size, [...Tuple, unknown]>);
type XLessThan<Left extends number, Right extends number> = Left extends Right ? false : XBuildTuple<Left> extends [...XBuildTuple<Right>, ...infer _Rest] ? false : true;
//#endregion
//#region node_modules/typebox/build/schema/static/_elements.d.mts
type XWithElements<Stack extends string[], Root extends XSchema, Schemas extends XSchema[], Result extends unknown[] = []> = (Schemas extends [infer Left extends XSchema, ...infer Right extends XSchema[]] ? XWithElements<Stack, Root, Right, [...Result, XStaticSchema<Stack, Root, Left>]> : Result);
type XWithMaxItemsRemap<Elements extends unknown[], MaxItems extends number, Result extends unknown[] = []> = (Elements extends [infer Left extends unknown, ...infer Right extends unknown[]] ? XLessThan<Result['length'], MaxItems> extends true ? XWithMaxItemsRemap<Right, MaxItems, [...Result, Left]> : Result : Result);
type XWithMaxItems<Schema extends XSchema, Elements extends unknown[], Result extends unknown[] = (Schema extends XMaxItems<infer MaxItems extends number> ? XWithMaxItemsRemap<Elements, MaxItems> : Elements)> = Result;
type XNeedsAdditionalItems<Schema extends XSchema, Elements extends unknown[], Result extends boolean = (Schema extends XMaxItems<infer MaxItems extends number> ? XLessThan<Elements['length'], MaxItems> : true)> = Result;
type XWithMinItemsRemap<Elements extends unknown[], MinItems extends number, Result extends unknown[] = []> = (Elements extends [infer Left, ...infer Right] ? XLessThan<Result['length'], MinItems> extends true ? XWithMinItemsRemap<Right, MinItems, [...Result, Left]> : XWithMinItemsRemap<Right, MinItems, [...Result, Left?]> : Result);
type XWithMinItems<Schema extends XSchema, Values extends unknown[], MinItems extends number = (Schema extends XMinItems<infer MinItems extends number> ? MinItems : 0), Result extends unknown[] = XWithMinItemsRemap<Values, MinItems>> = Result;
type XWithAdditionalItems<Stack extends string[], Root extends XSchema, Schema extends XSchema, Elements extends unknown[], Result extends unknown[] = (Schema extends XAdditionalItems<infer Schema extends XSchema> ? (Schema extends true ? [...Elements, ...unknown[]] : Schema extends false ? [...Elements] : [...Elements, ...XStaticSchema<Stack, Root, Schema>[]]) : [...Elements, ...unknown[]])> = Result;
type XStaticElements<Stack extends string[], Root extends XSchema, Schema extends XSchema, PrefixItems extends XSchema[], WithElements extends unknown[] = XWithElements<Stack, Root, PrefixItems>, WithMaxItems extends unknown[] = XWithMaxItems<Schema, WithElements>, NeedsAdditional extends boolean = XNeedsAdditionalItems<Schema, WithMaxItems>, WithMinItems extends unknown[] = XWithMinItems<Schema, WithMaxItems>, WithAdditionalItems extends unknown[] = (NeedsAdditional extends true ? XWithAdditionalItems<Stack, Root, Schema, WithMinItems> : WithMinItems)> = WithAdditionalItems;
//#endregion
//#region node_modules/typebox/build/schema/static/items.d.mts
type XFromSized<Stack extends string[], Root extends XSchema, Schema extends XSchema, Items extends XSchema[]> = (XStaticElements<Stack, Root, Schema, Items>);
type XFromUnsized<Stack extends string[], Root extends XSchema, Schema extends XSchema> = (XStaticSchema<Stack, Root, Schema>[]);
type XStaticItems<Stack extends string[], Root extends XSchema, Schema extends XSchema, Items extends XSchema[] | XSchema, Result extends unknown = (Items extends XSchema[] ? XFromSized<Stack, Root, Schema, [...Items]> : Items extends XSchema ? XFromUnsized<Stack, Root, Items> : never)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/oneOf.d.mts
type XStaticOneOf<Stack extends string[], Root extends XSchema, Schemas extends XSchema[], Result extends unknown = never> = (Schemas extends [infer Left extends XSchema, ...infer Right extends XSchema[]] ? XStaticOneOf<Stack, Root, Right, XStaticSchema<Stack, Root, Left> | Result> : Result);
//#endregion
//#region node_modules/typebox/build/schema/static/patternProperties.d.mts
type XStaticPatternProperties<Stack extends string[], Root extends XSchema, Properties extends Record<PropertyKey, XSchema> = Record<PropertyKey, XSchema>, InferredProperties extends Record<PropertyKey, unknown> = { [Key in keyof Properties]: XStaticSchema<Stack, Root, Properties[Key]> }, EvaluatedProperties extends unknown = {
  [key: string]: InferredProperties[keyof InferredProperties];
}> = EvaluatedProperties;
//#endregion
//#region node_modules/typebox/build/schema/static/prefixItems.d.mts
type XStaticPrefixItems<Stack extends string[], Root extends XSchema, Schema extends XSchema, PrefixItems extends XSchema[], Result extends unknown[] = XStaticElements<Stack, Root, Schema, PrefixItems>> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/properties.d.mts
type XIsReadonly<Schema extends XSchema> = (Schema extends {
  readOnly: true;
} ? true : Schema extends {
  '~readonly': true;
} ? true : false);
type XRequiredArray<Schema extends XSchema, Result extends PropertyKey[] = (Schema extends XRequired<infer Keys extends string[]> ? Keys : [])> = Result;
type XReadonlyKeys<Properties extends Record<PropertyKey, XSchema>, ReadonlyProperties extends Record<PropertyKey, unknown> = { [Key in keyof Properties as XIsReadonly<Properties[Key]> extends true ? Key : never]: unknown }, Result extends PropertyKey = keyof ReadonlyProperties> = Result;
type XRequiredKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[], Result extends PropertyKey = (RequiredArray extends [] ? never : Extract<keyof Properties, RequiredArray[number]>)> = Result;
type XUnknownKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[], Result extends PropertyKey = Exclude<RequiredArray[number], keyof Properties>> = Result;
type XOptionalKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[], Result extends PropertyKey = (RequiredArray extends [] ? keyof Properties : Exclude<keyof Properties, RequiredArray[number]>)> = Result;
type XReadonlyOptionalProperties<Stack extends string[], Root extends XSchema, OptionalKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = { readonly [Key in Extract<keyof Properties, OptionalKeys>]?: XStaticSchema<Stack, Root, Properties[Key]> };
type XReadonlyRequiredProperties<Stack extends string[], Root extends XSchema, RequiredKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = { readonly [Key in Extract<keyof Properties, RequiredKeys>]: XStaticSchema<Stack, Root, Properties[Key]> };
type XOptionalProperties<Stack extends string[], Root extends XSchema, OptionalKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = { [Key in Extract<keyof Properties, OptionalKeys>]?: XStaticSchema<Stack, Root, Properties[Key]> };
type XRequiredProperties<Stack extends string[], Root extends XSchema, RequiredKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = { [Key in Extract<keyof Properties, RequiredKeys>]: XStaticSchema<Stack, Root, Properties[Key]> };
type XUnknownProperties<UnknownKeys extends PropertyKey> = { [Key in UnknownKeys]: unknown };
type XStaticProperties<Stack extends string[], Root extends XSchema, Schema extends XSchema, Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[] = XRequiredArray<Schema>, ReadonlyKeys extends PropertyKey = XReadonlyKeys<Properties>, OptionalKeys extends PropertyKey = XOptionalKeys<Properties, RequiredArray>, RequiredKeys extends PropertyKey = XRequiredKeys<Properties, RequiredArray>, UnknownKeys extends PropertyKey = XUnknownKeys<Properties, RequiredArray>, ReadonlyOptionalProperties extends Record<PropertyKey, unknown> = XReadonlyOptionalProperties<Stack, Root, Extract<OptionalKeys, ReadonlyKeys>, Properties>, ReadonlyRequiredProperties extends Record<PropertyKey, unknown> = XReadonlyRequiredProperties<Stack, Root, Extract<RequiredKeys, ReadonlyKeys>, Properties>, OptionalProperties extends Record<PropertyKey, unknown> = XOptionalProperties<Stack, Root, Exclude<OptionalKeys, ReadonlyKeys>, Properties>, RequiredProperties extends Record<PropertyKey, unknown> = XRequiredProperties<Stack, Root, Exclude<RequiredKeys, ReadonlyKeys>, Properties>, UnknownProperties extends Record<PropertyKey, unknown> = XUnknownProperties<UnknownKeys>, Result extends Record<PropertyKey, unknown> = (ReadonlyOptionalProperties & ReadonlyRequiredProperties & OptionalProperties & RequiredProperties & UnknownProperties)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/pointer/pointer_get.d.mts
type TEscape0<Index extends string> = Index extends `${infer Left}~0${infer Right}` ? `${Left}~${TEscape<Right>}` : Index;
type TEscape1<Index extends string> = Index extends `${infer Left}~1${infer Right}` ? `${Left}/${TEscape<Right>}` : Index;
type TEscape<Index extends string, Escaped0 extends string = TEscape0<Index>, Escaped1 extends string = TEscape1<Escaped0>> = Escaped1;
type IndicesReduce<Pointer extends string, Result extends string[] = []> = (Pointer extends `${infer Left extends string}/${infer Right extends string}` ? Left extends '' ? IndicesReduce<Right, Result> : IndicesReduce<Right, [...Result, TEscape<Left>]> : [...Result, TEscape<Pointer>]);
type TIndices<Pointer extends string, Result extends string[] = (Pointer extends '' ? [] : IndicesReduce<Pointer>)> = Result;
type TResolve<Value extends unknown, Indices extends string[]> = (Indices extends [infer Left extends string, ...infer Right extends string[]] ? Left extends keyof Value ? TResolve<Value[Left], Right> : undefined : Value);
/** Type Level RFC 6901 Json Pointer Resolver */
type XPointerGet<Value extends unknown, Pointer extends string, Indices extends string[] = TIndices<Pointer>, Result extends unknown = TResolve<Value, Indices>> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/ref.d.mts
type XCyclicCheck<Stack extends unknown[], MaxLength extends number, Buffer extends unknown[] = []> = (Stack extends [infer Left, ...infer Right] ? Buffer['length'] extends MaxLength ? false : XCyclicCheck<Right, MaxLength, [...Buffer, Left]> : true);
type XCyclicGuard<Stack extends unknown[], Ref extends string> = (Ref extends Stack[number] ? XCyclicCheck<Stack, 2> : true);
type XNormal<Pointer extends string, Result extends string = (Pointer extends `#${infer Rest extends string}` ? Rest : Pointer)> = Result;
type XStaticRef<Stack extends string[], Root extends XSchema, Ref extends string, Normal extends string = XNormal<Ref>, Target extends unknown = XPointerGet<Root, Normal>, Schema extends XSchema = (Target extends XSchema ? Target : {}), Result extends unknown = (XCyclicGuard<Stack, Ref> extends true ? XStaticSchema<[...Stack, Ref], Root, Schema> : any)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/required.d.mts
type XStaticRequired<_Stack extends string[], _Root extends XSchema, Schema extends XSchema, Keys extends string[], Result extends Record<PropertyKey, unknown> = (Schema extends XProperties ? {} : Record<Keys[number], unknown>)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/type.d.mts
type XFromTypeNames<TypeNames extends string[], Result extends unknown = never> = (TypeNames extends readonly [infer Left extends string, ...infer Right extends string[]] ? XFromTypeNames<Right, Result | XFromTypeName<Left>> : Result);
type XFromTypeName<TypeName extends string> = (TypeName extends 'object' ? object : TypeName extends 'array' ? {} : TypeName extends 'boolean' ? boolean : TypeName extends 'integer' ? number : TypeName extends 'number' ? number : TypeName extends 'null' ? null : TypeName extends 'string' ? string : TypeName extends 'bigint' ? bigint : TypeName extends 'symbol' ? symbol : TypeName extends 'undefined' ? undefined : TypeName extends 'void' ? void : TypeName extends 'asyncIterator' ? {} : TypeName extends 'constructor' ? {} : TypeName extends 'function' ? {} : TypeName extends 'iterator' ? {} : unknown);
type XStaticType<TypeName extends string[] | string> = (TypeName extends string[] ? XFromTypeNames<TypeName> : TypeName extends string ? XFromTypeName<TypeName> : unknown);
//#endregion
//#region node_modules/typebox/build/schema/static/unevaluatedProperties.d.mts
type XStaticUnevaluatedProperties<Stack extends string[], Root extends XSchema, Schema extends XSchema, Result extends Record<PropertyKey, unknown> = (Schema extends true ? {
  [key: string]: unknown;
} : Schema extends false ? {} : {
  [key: string]: XStaticSchema<Stack, Root, Schema>;
})> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/schema.d.mts
type XFromKeywords<Stack extends string[], Root extends XSchema, Schema extends XSchema, Result extends unknown[] = [Schema extends XAdditionalProperties<infer Type extends XSchema> ? XStaticAdditionalProperties<Stack, Root, Type> : unknown, Schema extends XAllOf<infer Types extends XSchema[]> ? XStaticAllOf<Stack, Root, Types> : unknown, Schema extends XAnyOf<infer Types extends XSchema[]> ? XStaticAnyOf<Stack, Root, Types> : unknown, Schema extends XConst<infer Value extends unknown> ? XStaticConst<Value> : unknown, Schema extends XIf<infer Type extends XSchema> ? XStaticIf<Stack, Root, Schema, Type> : unknown, Schema extends XEnum<infer Values extends unknown[]> ? XStaticEnum<Values> : unknown, Schema extends XItems<infer Types extends XSchema[] | XSchema> ? XStaticItems<Stack, Root, Schema, Types> : unknown, Schema extends XOneOf<infer Types extends XSchema[]> ? XStaticOneOf<Stack, Root, Types> : unknown, Schema extends XPatternProperties<infer Properties extends Record<PropertyKey, XSchema>> ? XStaticPatternProperties<Stack, Root, Properties> : unknown, Schema extends XPrefixItems<infer Types extends XSchema[]> ? XStaticPrefixItems<Stack, Root, Schema, Types> : unknown, Schema extends XProperties<infer Properties extends Record<PropertyKey, XSchema>> ? XStaticProperties<Stack, Root, Schema, Properties> : unknown, Schema extends XRef<infer Ref extends string> ? XStaticRef<Stack, Root, Ref> : unknown, Schema extends XRequired<infer Keys extends string[]> ? XStaticRequired<Stack, Root, Schema, Keys> : unknown, Schema extends XType<infer TypeName extends string[] | string> ? XStaticType<TypeName> : unknown, Schema extends XUnevaluatedProperties<infer Type extends XSchema> ? XStaticUnevaluatedProperties<Stack, Root, Type> : unknown]> = Result;
type XKeywordsIntersected<Schemas extends unknown[], Result extends unknown = unknown> = (Schemas extends [infer Left extends unknown, ...infer Right extends unknown[]] ? XKeywordsIntersected<Right, Result & Left> : Result);
type XKeywordsEvaluated<Schema extends unknown, Result extends unknown = (Schema extends object ? { [Key in keyof Schema]: Schema[Key] } : Schema)> = Result;
type XStaticObject<Stack extends string[], Root extends XSchema, Schema extends XSchema, Keywords extends unknown[] = XFromKeywords<Stack, Root, Schema>, Intersected extends unknown = XKeywordsIntersected<Keywords>, Evaluated extends unknown = XKeywordsEvaluated<Intersected>> = Evaluated;
type XStaticBoolean<Schema extends boolean, Result extends unknown = (Schema extends false ? never : unknown)> = Result;
type XStaticSchema<Stack extends string[], Root extends XSchema, Schema extends XSchema, Result extends unknown = (Schema extends boolean ? XStaticBoolean<Schema> : XStaticObject<Stack, Root, Schema>)> = Result;
//#endregion
//#region node_modules/typebox/build/schema/static/static.d.mts
type XStatic<Value extends unknown, Schema extends XSchema = (Value extends XSchema ? Value : {}), Canonical extends XSchema = XCanonical<Schema>, Result extends unknown = XStaticSchema<[], Canonical, Canonical>> = Result;
//#endregion
//#region node_modules/typebox/build/type/types/static.d.mts
type StaticEvaluate<T> = { [K in keyof T]: T[K] } & {};
type StaticDirection = 'Encode' | 'Decode';
type StaticType<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema> = (Type extends TCodec<infer Type extends TSchema, infer Decoded extends unknown> ? StaticCodec<Stack, Direction, Context, This, Type, Decoded> : Type extends TAny ? StaticAny : Type extends TArray<infer Items extends TSchema> ? StaticArray<Stack, Direction, Context, This, Type, Items> : Type extends TAsyncIterator<infer Type extends TSchema> ? StaticAsyncIterator<Stack, Direction, Context, This, Type> : Type extends Base<infer Value extends unknown> ? StaticBase<Value> : Type extends TBigInt ? StaticBigInt : Type extends TBoolean ? StaticBoolean : Type extends TConstructor<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? StaticConstructor<Stack, Direction, Context, This, Parameters, ReturnType> : Type extends TEnum<infer Values extends TEnumValue[]> ? StaticEnum<Values> : Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? StaticFunction<Stack, Direction, Context, This, Parameters, ReturnType> : Type extends TInteger ? StaticInteger : Type extends TIntersect<infer Types extends TSchema[]> ? StaticIntersect<Stack, Direction, Context, This, Types> : Type extends TIterator<infer Types extends TSchema> ? StaticIterator<Stack, Direction, Context, This, Types> : Type extends TLiteral<infer Value extends TLiteralValue> ? StaticLiteral<Value> : Type extends TNever ? StaticNever : Type extends TNull ? StaticNull : Type extends TNumber ? StaticNumber : Type extends TObject<infer Properties extends TProperties> ? StaticObject<Stack, Direction, Context, This, Properties> : Type extends TPromise<infer Type extends TSchema> ? StaticPromise<Stack, Direction, Context, This, Type> : Type extends TRecord<infer Key extends string, infer Value extends TSchema> ? StaticRecord<Stack, Direction, Context, This, Key, Value> : Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? StaticCyclic<Stack, Direction, Context, This, Defs, Ref> : Type extends TRef<infer Ref extends string> ? StaticRef<Stack, Direction, Context, This, Ref> : Type extends TString ? StaticString : Type extends TSymbol ? StaticSymbol : Type extends TTemplateLiteral<infer Pattern extends string> ? StaticTemplateLiteral<Pattern> : Type extends TThis ? StaticThis<Stack, Direction, Context, This> : Type extends TTuple<infer Items extends TSchema[]> ? StaticTuple<Stack, Direction, Context, This, Type, Items> : Type extends TUndefined ? StaticUndefined : Type extends TUnion<infer Types extends TSchema[]> ? StaticUnion<Stack, Direction, Context, This, Types> : Type extends TUnknown ? StaticUnknown : Type extends TUnsafe<infer Type extends unknown> ? StaticUnsafe<Type> : Type extends TVoid ? StaticVoid : XStatic<Type>);
/** Infers a static type from a TypeBox type. */
type Static<Type extends TSchema, Context extends TProperties = {}, Result extends unknown = StaticType<[], 'Encode', Context, {}, Type>> = Result;
//#endregion
//#region node_modules/typebox/build/type/types/properties.d.mts
type ReadonlyOptionalKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TReadonly<TSchema> ? (Properties[Key] extends TOptional<Properties[Key]> ? Key : never) : never }[keyof Properties]> = Result;
type ReadonlyKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TReadonly<TSchema> ? (Properties[Key] extends TOptional<Properties[Key]> ? never : Key) : never }[keyof Properties]> = Result;
type OptionalKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TOptional<TSchema> ? (Properties[Key] extends TReadonly<Properties[Key]> ? never : Key) : never }[keyof Properties]> = Result;
type RequiredKeys<Properties extends TProperties, Result extends PropertyKey = keyof Omit<Properties, ReadonlyOptionalKeys<Properties> | ReadonlyKeys<Properties> | OptionalKeys<Properties>>> = Result;
type StaticPropertiesWithModifiers<Properties extends TProperties, PropertiesWithoutModifiers extends Record<PropertyKey, unknown>> = StaticEvaluate<Readonly<Partial<Pick<PropertiesWithoutModifiers, ReadonlyOptionalKeys<Properties>>>> & Readonly<Pick<PropertiesWithoutModifiers, ReadonlyKeys<Properties>>> & Partial<Pick<PropertiesWithoutModifiers, OptionalKeys<Properties>>> & Required<Pick<PropertiesWithoutModifiers, RequiredKeys<Properties>>>>;
type StaticPropertiesWithoutModifiers<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Properties extends TProperties, Result extends Record<PropertyKey, unknown> = { [Key in keyof Properties]: StaticType<Stack, Direction, Context, This, Properties[Key]> }> = Result;
type StaticProperties<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Properties extends TProperties, PropertiesWithoutModifiers extends Record<PropertyKey, unknown> = StaticPropertiesWithoutModifiers<Stack, Direction, Context, This, Properties>, PropertiesWithModifiers extends Record<PropertyKey, unknown> = StaticPropertiesWithModifiers<Properties, PropertiesWithoutModifiers>, Result extends Record<PropertyKey, unknown> = { [Key in keyof PropertiesWithModifiers]: PropertiesWithModifiers[Key] }> = Result;
/** Represents a Record<PropertyKey, TSchema> structure. */
interface TProperties extends TSchema {
  [key: PropertyKey]: TSchema;
}
/** Creates a RequiredArray derived from the given TProperties value. */
type TRequiredArray<Properties extends TProperties, RequiredProperties extends TProperties = { [Key in keyof Properties as Properties[Key] extends TOptional<Properties[Key]> ? never : Key]: Properties[Key] }, RequiredKeys extends string[] = TUnionToTuple<Extract<keyof RequiredProperties, string>>, Result extends string[] | undefined = (RequiredKeys extends [] ? undefined : RequiredKeys)> = Result;
type TKeyToString<Key extends number | string> = `${Key}`;
/** Extracts a tuple of keys from a TProperties value. */
type TPropertyKeys<Properties extends TProperties, ExtractKey extends number | string = Extract<keyof Properties, number | string>, StringKey extends string = TKeyToString<ExtractKey>, Result extends string[] = TUnionToTuple<StringKey>> = Result;
type TPropertyValuesReduce<Properties extends TProperties, Keys extends string[], Result extends TSchema[] = []> = Keys extends [infer Left extends string, ...infer Right extends string[]] ? Left extends keyof Properties ? TPropertyValuesReduce<Properties, Right, [...Result, Properties[Left]]> : TPropertyValuesReduce<Properties, Right, Result> : Result;
/** Extracts a tuple of property values from a TProperties value. */
type TPropertyValues<Properties extends TProperties, Keys extends string[] = TPropertyKeys<Properties>, Result extends TSchema[] = TPropertyValuesReduce<Properties, Keys>> = Result;
//#endregion
//#region node_modules/typebox/build/type/engine/awaited/instantiate.d.mts
type TAwaitedOperation<Type extends TSchema> = (Type extends TPromise<infer Type extends TSchema> ? TAwaitedOperation<Type> : Type);
type TAwaitedAction<Type extends TSchema, Result extends TSchema = (TCanInstantiate<[Type]> extends true ? TAwaitedOperation<Type> : TAwaitedDeferred<Type>)> = Result;
type TAwaitedInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, InstantiateType extends TSchema = TInstantiateType<Context, State, Type>> = TAwaitedAction<InstantiateType>;
//#endregion
//#region node_modules/typebox/build/type/action/awaited.d.mts
/** Creates a deferred Awaited action. */
type TAwaitedDeferred<Type extends TSchema> = (TDeferred<'Awaited', [Type]>);
//#endregion
//#region index.d.ts
declare const DokuPaymentParamsSchema: TObject<{
  nama_klien: TString;
  item_deskripsi: TString;
  nominal_rupiah: TNumber;
}>;
type DokuPaymentParams = Static<typeof DokuPaymentParamsSchema>;
interface DokuToolDetails {
  status: "success" | "failed";
  payment_url?: string;
  invoice_number?: string;
  nama_klien?: string;
  item_deskripsi?: string;
  nominal_rupiah?: number;
  error?: string;
}
interface DokuToolResult {
  content: {
    type: "text";
    text: string;
  }[];
  details: DokuToolDetails;
}
/**
 * Build Doku HMAC-SHA256 signature header value.
 *
 * Mirrors the working Python implementation in paygent-backend/tools/doku_tool.py.
 * Reference: https://developers.doku.com/getting-started-with-doku-api/signature-component/non-snap/sample-code
 *
 * Component (newline-separated, no trailing newline):
 *   Client-Id:<client_id>
 *   Request-Id:<request_id>
 *   Request-Timestamp:<request_timestamp>
 *   Request-Target:<request_target>
 *   Digest:<base64(sha256(body_str))>
 *
 * IMPORTANT: body_str must be the EXACT same string sent over the wire.
 */
declare function buildDokuSignature(args: {
  clientId: string;
  secretKey: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  bodyStr: string;
}): string;
/**
 * Execute the Doku create-payment-link tool. This is the canonical implementation
 * that both the OpenClaw plugin entry and the bridge server share.
 */
declare function executeDokuCreatePaymentLink(params: DokuPaymentParams): Promise<DokuToolResult>;
/**
 * OpenClaw plugin entry. Used by the OpenClaw Gateway when running with the full
 * harness. The bridge server in paygent-openclaw/server/bridge.ts invokes
 * `executeDokuCreatePaymentLink` directly with the same schema and parameters.
 */
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: _$openclaw_plugin_sdk_core0.OpenClawPluginConfigSchema;
  register: NonNullable<_$openclaw_plugin_sdk_core0.OpenClawPluginDefinition["register"]>;
} & Pick<_$openclaw_plugin_sdk_core0.OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
//#endregion
export { DokuPaymentParams, DokuPaymentParamsSchema, DokuToolDetails, DokuToolResult, buildDokuSignature, _default as default, executeDokuCreatePaymentLink };