#!/usr/bin/env python3
#-----------------------------------------------------------------------
#Author: Vicente Benjumea
#Creation time: 2023/08/28 11:28:08
#Modification time: 2026/05/08 19:47:56
#-----------------------------------------------------------------------
__author__ = "Vicente Benjumea"
__version__ = "2026.05.08.19.47.56"
#-----------------------------------------------------------------------
"""Módulo de operaciones de soporte para unittesting.

- ChkNames = typing.NamedTuple("ChkNames", (("falta", list[str]), ("extra", list[str])))

- chkObjVarNames(obj, ref_names, *, rem_prefix) -> ChkNames:
    Compara los nombres de atributos del objeto con los nombres de ref_names,
    y devuelve los nombres que faltan y los nombres extras. Elimina de
    los nombres extras aquellos que comienzan por los prefijos especificados
    en rem_prefix.

- get_mro_nms(cls: type) -> list[str]:
    Devuelve una lista con los nombres de las clases del MRO de la clase
    recibida como parámetro.

- is_protocol(cls: type) -> bool:
    devuelve True si CLS es Protocol

- get_attr_nms(obj: object) -> tuple[str]:
    Devuelve una tupla con los nombres de los atributos del objeto recibido
    como parámetro.

- get_pubmths_nms(cls: type) -> set[str]:
    Devuelve un conjunto con los nombres de los métodos públicos de la clase
    recibida como parámetro.

- sorted_relitem(item_number: int, lista_tupla: list[tuple],
                 *, norm:str=None,
                 ordalt: list[tuple]=None) -> list[tuple]:
  devuelve una lista de tuplas ordenada segun el orden relativo de
  ITEM_NUMBER de cada tupla.
  NORM modo de normalizacion ('lower').
  ORDALT tomar ordenacion de Orden alternativo

- normdata(data: typing.Any, *,
           prfxtp: bool = True,
           nrmitm: Optional[dict[type, Callable[[Any],Any]]] = None) -> list:
    devuelve los datos normalizados. Es de utilidad para comparar
    estructuras de datos con los valores esperados.
    prfxtp: indica anteponer el tipo (por defecto true)
    nrmitm: diccionario que asocia un tipo con la funcion de serializacion a tupla

- data2list(data: typing.Any, *,
            nrmitm: Optional[dict[type, Callable[[Any],Any]]] = None) -> list:
    devuelve los datos normalizados en lista de tuplas. Es de
    utilidad para comparar estructuras de datos con los valores
    esperados.
    nrmitm: diccionario que asocia un tipo con la funcion de serializacion a tupla

- flattendata(data: typing.Any, *,
                level: int = -1) -> list[tuple]:
    devuelve una lista aplanada de tuplas con los elementos de
    data. Es de utilidad para comparar estructuras de datos con los
    valores esperados. En caso de set y dict, las tuplas de la lista
    seran ordenadas. level==0 no se aplana. level negativo, aplana
    todos los niveles. level positivo aplana ese numero de niveles.

- str2normsp(string: str, *,
             sp: typing.Optional[str] = None,
             nl: typing.Optional[str] = None,
             stripmode: str = "rstrip") -> str:
    Devuelve el string con espacios normalizados.
    Cada línea rstrip espacios según arg STRIPMODE.
    Reemplaza espacios por arg SP.
    Reemplaza saltos de linea por arg NL.

- str2ascii(string: str) -> str:
    devuelve el string normalizado ascii

- str2tk(string: str, *,
         lower: bool = None,           # convert strings to lower-case
         cnvt_ascii: bool = None,      # convert strings to ascii
         rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
         rem_nnum: bool = None,        # remove all not number tokens
         rem_in: str = None,           # remove tokens in rem_in
         rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
         rem_nin: str = None,          # remove tokens not in rem_nin
         sort_all: bool = None,        # sort all tokens
         sort_begin: str = None,       # sorted region beginning token
         sort_end: str = None) -> str: # sorted region ending token
    devuelve el string normalizado tokens

- str2tkref(string: str, reference: str, *,
            lower: bool = None,           # convert strings to lower-case
            cnvt_ascii: bool = None,      # convert strings to ascii
            rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
            rem_nnum: bool = None,        # remove all not number tokens
            rem_in: str = None,           # remove tokens in rem_in
            rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
            rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
            sort_all: bool = None,        # sort all tokens
            sort_begin: str = None,       # sorted region beginning token
            sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    devuelve el string y reference normalizado tokens

- str2tkalnum(string: str, *,
              lower: bool = None,           # convert strings to lower-case
              rem_in: str = None,           # remove tokens in rem_in
              rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
              rem_nin: str = None,          # remove tokens not in rem_nin
              sort_all: bool = None,        # sort all tokens
              sort_begin: str = None,       # sorted region beginning token
              sort_end: str = None) -> str: # sorted region ending token
    devuelve el string normalizado tokens alpha-ascii&numbers

- str2tkalnumref(string: str, reference: str, *,
                 lower: bool = None,           # convert strings to lower-case
                 rem_in: str = None,           # remove tokens in rem_in
                 rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
                 rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                 sort_all: bool = None,        # sort all tokens
                 sort_begin: str = None,       # sorted region beginning token
                 sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    devuelve el string y reference normalizado tokens alpha-ascii&numbers

- str2tkascii(string: str, *,
              lower: bool = None,           # convert strings to lower-case
              rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
              rem_in: str = None,           # remove tokens in rem_in
              rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
              rem_nin: str = None,          # remove tokens not in rem_nin
              sort_all: bool = None,        # sort all tokens
              sort_begin: str = None,       # sorted region beginning token
              sort_end: str = None) -> str: # sorted region ending token
    devuelve el string normalizado tokens ascii

- str2tkasciiref(string: str, reference: str, *,
                 lower: bool = None,           # convert strings to lower-case
                 rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
                 rem_in: str = None,           # remove tokens in rem_in
                 rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
                 rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                 sort_all: bool = None,        # sort all tokens
                 sort_begin: str = None,       # sorted region beginning token
                 sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    devuelve el string y reference normalizado tokens ascii

- str2tknumber(string: str, *,
               rem_in: str = None,           # remove tokens in rem_in
               rem_nin: str = None,          # remove tokens not in rem_nin
               sort_all: bool = None,        # sort all tokens
               sort_begin: str = None,       # sorted region beginning token
               sort_end: str = None) -> str: # sorted region ending token
    devuelve el string normalizado tokens de números

- str2tknumberref(string: str, reference: str, *,
                  rem_in: str = None,           # remove tokens in rem_in
                  rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                  sort_all: bool = None,        # sort all tokens
                  sort_begin: str = None,       # sorted region beginning token
                  sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    devuelve el string y reference normalizado tokens de números

- file2str(filename: str) -> str:
    devuelve el string con el contenido del fichero (o str(exc))

- str2file(filename: str, contenido: str) -> bool:
    escribe el contenido en el fichero especificado

- remove_file(filename: str) -> bool:
    elimina el fichero especificado

- with IOCapture("1\n2\n3\n4\n") as io_capture:
        print("Introduce valores")
        v1 = int(input("Valor 1"))
        print("Resultado:", v1)
    print(io_capture.get_stdout_value())
    print(io_capture.get_stderr_value())

"""
#-----------------------------------------------------------------------
import math
import io
import sys
import re
import typing
import types
import dataclasses
#import typing_extensions
import inspect
import unittest
#import unittest.util
import logging
import traceback
import signal
import threading
import functools
import os
import os.path
import unicodedata
#-----------------------------------------------------------------------
#-- WatchDogTimer ------------------------------------------------------
#-----------------------------------------------------------------------
DEF_TEST_TIMEOUT = 15 # segundos
#-----------------------------------------------------------------------
# Timeout Error
#-----------------------------------
class TimeoutError(BaseException):
    """Timeout error."""
    pass
#-----------------------------------------------------------------------
# En Python, el manejador de señal solo se puede establecer desde la
# "hebra principal", y cuando se recibe una señal, solo la maneja la
# "hebra principal", por lo que este metodo no es adecuado para
# interrumpir programas con multuiples hebras, o multiples procesos.
#-----------------------------------------------------------------------
# POSIX: SIGABRT, SIGINT, SIGQUIT, SIGTERM, SIGUSR1,  SIGUSR2
# WIndows: SIGABRT, SIGINT, SIGTERM, SIGBREAK
#-----------------------------------
# Timeout Context Manager
#-----------------------------------
class TimeoutCtx:
    """Timeout context manager. When time expires, the execution of
    context statements is aborted by raising the Timeout Error
    exception."""
    def __init__(self, seconds: int, *args, **kwargs) -> None:
        self.__seconds = seconds
        self.__timer = None
        self.__old_sighandler = None
        super().__init__(*args, **kwargs)

    def __raise_exception(self, *args, **kwargs) -> None:
        #print(f"DBG TimeoutCtx __raise_exception thread: {threading.get_ident()}")
        raise TimeoutError("Timeout")

    def __timer_callback(self, *args, **kwargs) -> None:
        #print(f"DBG TimeoutCtx __timer_callback thread: {threading.get_ident()}")
        signal.raise_signal(signal.SIGABRT)

    def __enter__(self) -> 'TimeoutCtx':
        #print(f"DBG TimeoutCtx enter thread: {threading.get_ident()}")
        self.__old_sighandler = signal.signal(signal.SIGABRT, self.__raise_exception)
        self.__timer = threading.Timer(self.__seconds, self.__timer_callback)
        self.__timer.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        #print(f"DBG TimeoutCtx exit  thread: {threading.get_ident()}")
        self.__timer.cancel()
        signal.signal(signal.SIGABRT, self.__old_sighandler)
        self.__timer.join()
        self.__timer = None
        self.__old_sighandler = None
        return None
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
# Timeout function decorator
#-----------------------------------
def Timeout(seconds: int):
    """Function decorator. The decorated function will raise a Timeout
    exception if its execution time exceeds the specified timeout."""
    def wrapper(func):
        @functools.wraps(func)
        def func_timeout_wrapper(*args, **kwargs):
            with TimeoutCtx(seconds):
                return func(*args, **kwargs)
        return func_timeout_wrapper
    return wrapper
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
# https://docs.python.org/es/3/library/stdtypes.html#special-attributes
# https://docs.python.org/3/reference/datamodel.html#user-defined-functions
# https://docs.python.org/3/library/inspect.html
#-----------------------------------------------------------------------
#-- InternalError ------------------------------------------------------
#-----------------------------------------------------------------------
class InternalError(RuntimeError):
    """InternalError shows internal errors in testing code."""
    pass
#-----------------------------------------------------------------------
#-- Introspection ------------------------------------------------------
#-----------------------------------------------------------------------
def get_mro_nms(cls: type) -> list[str]:
    """Devuelve una lista con los nombres de las clases del MRO de la clase
    recibida como parámetro."""
    if inspect.isclass(cls):
        mro_nms: list[str] = [c.__name__ for c in cls.__mro__]
    else:
        mro_nms: list[str] = list()
    return mro_nms
#-----------------------------------------------------------------------
def is_abstractclass(cls: type) -> bool:
    """devuelve True si CLS es Abstract Class"""
    ok = False
    if inspect.isclass(cls):
        ok = inspect.isabstract(cls)
    return ok
#-----------------------------------------------------------------------
def is_namedtuple(cls: type) -> bool:
    """devuelve True si CLS es NamedTuple"""
    return (inspect.isclass(cls)
            and (cls.__mro__ == (cls, tuple, object))
            and all(hasattr(cls, attr) for attr in ("_fields",
                                                    "_field_defaults",
                                                    "_make",
                                                    "_replace",
                                                    "_asdict")))
#-----------------------------------------------------------------------
def is_dataclass(cls: type) -> bool:
    """devuelve True si CLS es dataclass"""
    return inspect.isclass(cls) and dataclasses.is_dataclass(cls)
#-----------------------------------------------------------------------
def is_protocol(cls: type) -> bool:
    """devuelve True si CLS es Protocol"""
    ok = False
    if inspect.isclass(cls):
        # https://typing.python.org/en/latest/spec/protocol.html#merging-and-extending-protocols
        # Subclassing a protocol class would not turn the subclass
        # into a protocol unless it also has typing.Protocol as an
        # explicit base class.
        ##ok = any(c is typing.Protocol for c in cls.__mro__)
        ok = any(c is typing.Protocol for c in cls.__bases__)
        ## ok = typing.is_protocol(cls) ## python 3.13
    return ok
#-----------------------------------------------------------------------
def get_attr_nms(obj: object) -> tuple[str]:
    """Devuelve una tupla con los nombres de los atributos del objeto recibido
    como parámetro."""
    try:
        # curr_names = tuple(name for (name, value) in inspect.getmembers(obj, inspect.ismethod))
        if hasattr(obj, "_fields"):
            obj_var_names = tuple(obj._fields)
        elif dataclasses.is_dataclass(obj):
            obj_var_names: tuple[str] = tuple(field.name for field in dataclasses.fields(obj))
        elif hasattr(obj, "__dict__"):
            obj_var_names = tuple(vars(obj).keys())
        else:
            obj_var_names = tuple()
    except (ValueError, TypeError, AttributeError):
        obj_var_names = tuple()
    return obj_var_names
#-----------------------------------------------------------------------
_PRIVMTH_REGEX = re.compile(r'^_[A-Z][A-Za-z0-9]*__[a-z][A-Z_a-z0-9]*$')
def _is_privmth(name: str) -> bool:
    return bool(_PRIVMTH_REGEX.fullmatch(name))
#-----------------------------------------------------------------------
def get_pubmths_nms(cls: type) -> set[str]:
    """Devuelve un conjunto con los nombres de los métodos públicos de la clase
    recibida como parámetro."""
    if inspect.isclass(cls):
        pubmths_nms: set[str] = set(name for (name, value) in inspect.getmembers(cls, inspect.isfunction) if not _is_privmth(name))
        if is_protocol(cls):
            pubmths_nms -= {'__init__', '__subclasshook__'}
        elif is_namedtuple(cls):
            pubmths_nms -= {'__init__', '__getnewargs__', '__new__', '__repr__', '_make', '_asdict', '_replace'}
        elif is_dataclass(cls):
            pubmths_nms -= {'__init__', '__repr__'}
    else:
        pubmths_nms: set[str] = set()
    return pubmths_nms
#-----------------------------------------------------------------------
ChkNames = typing.NamedTuple("ChkNames", (("falta", list[str]), ("extra", list[str])))
#-----------------------------------------------------------------------
def _chkNameSeqs(curr_names: typing.Sequence[str],
                 ref_names: typing.Sequence[str], *,
                 rem_prefix: typing.Optional[str|typing.Sequence[str]] = None) -> ChkNames:
    """Compara las secuencias de nombres curr_names con ref_names,
    y devuelve los nombres que faltan y los nombres extras en/de
    curr_names. Elimina de los nombres extras aquellos que comienzan
    por los prefijos especificados en rem_prefix"""
    if not isinstance(ref_names, (tuple,list,set)):
        raise InternalError("ref-names-arg is not a sequence")
    if not isinstance(curr_names, (tuple,list,set)):
        raise InternalError("curr-names-arg is not a sequence")
    names_falta = list()
    names_extra = list()
    for nm in ref_names:
        if nm not in curr_names:
            names_falta.append(nm)
    for nm in curr_names:
        if nm not in ref_names:
            names_extra.append(nm)
    if isinstance(rem_prefix, (str)):
        rem_prefix = [rem_prefix]
    if isinstance(rem_prefix, (tuple,list,set)):
        #names_extra = [nm for nm in names_extra if not any(nm.startswith(pfx) for pfx in rem_prefix)]
        for nmprfx in rem_prefix:
            names_extra = [nm for nm in names_extra if not nm.startswith(nmprfx)]
    return ChkNames(falta=names_falta, extra=names_extra)
#-----------------------------------------------------------------------
def chkObjVarNames(obj, ref_names: typing.Sequence[str], *,
                   rem_prefix: typing.Optional[str|typing.Sequence[str]] = None) -> ChkNames:
    """Compara los nombres de atributos del objeto con los nombres de ref_names,
    y devuelve los nombres que faltan y los nombres extras. Elimina de
    los nombres extras aquellos que comienzan por los prefijos especificados
    en rem_prefix"""
    try:
        # curr_names = tuple(name for (name, value) in inspect.getmembers(obj))
        if hasattr(obj, "_fields"):
            curr_names = tuple(obj._fields)
        elif hasattr(obj, "__dict__"):
            curr_names = tuple(vars(obj).keys())
        else:
            curr_names = tuple()
    except (ValueError, TypeError, AttributeError):
        curr_names = tuple()
    return _chkNameSeqs(curr_names=curr_names, ref_names=ref_names, rem_prefix=rem_prefix)
# --------------------------------------------------------------------- 
# -- Ordenar una lista de tuplas segun orden relativo ----------------- 
# --------------------------------------------------------------------- 
def _norm_item(item: typing.Any, norm: str) -> typing.Any:
    if isinstance(item, str):
        if (norm == "lower"):
            item = item.lower()
    return item
# ---------------------------------
def _bsc(lst: list[typing.Any], item: typing.Any) -> int:
    try:
        idx = lst.index(item)
    except ValueError:
        idx = len(lst)
    return idx
# --------------------------------- 
def sorted_relitem(item_number: int, lista_tupla: list[tuple],
                   *, norm:str=None,
                   ordalt: list[tuple]=None) -> list[tuple]:
    """devuelve una lista de tuplas ordenada segun el orden relativo de
    ITEM_NUMBER de cada tupla.
    NORM modo de normalizacion ('lower').
    ORDALT tomar ordenacion de Orden alternativo"""
    if (len(lista_tupla) == 0):
        sorted_list = list()
    elif (0 <= item_number < len(lista_tupla[0])):
        if ordalt is None:
            ordalt = lista_tupla
        itemlist = [ _norm_item(item[item_number], norm) for item in ordalt ]
        sorted_list = sorted(lista_tupla, key=lambda item: _bsc(itemlist, _norm_item(item[item_number], norm)))
    else:
        raise InternalError(f"SortedByItem bad args [{item_number}]")
    return sorted_list
# --------------------------------- 
# # ordena segun el primer elemento (unitario) de la tupla
# def lstpl_key(lstpl: list[tuple]) -> list[tuple]:
#     return sorted(lstpl, key=lambda item: [x[0] for x in lstpl].index(item[0]))
#-----------------------------------------------------------------------
#-- Ordenar Elementos de diccionarios y conjuntos ----------------------
#-----------------------------------------------------------------------
def _sort_dict_items(dict_items: typing.Iterable[tuple[typing.Any,typing.Any]]) -> list[tuple[typing.Any,typing.Any]]:
    try:
        elementos = sorted(dict_items)
    except TypeError:
        # Esta ordenacion puede no ser adecuada en caso de colisiones de hash
        elementos = sorted(dict_items, key=lambda item: hash(item[0]))
    return elementos
#-----------------------------------
def _sort_set_items(set_items: set[typing.Any]) -> list[typing.Any]:
    try:
        elementos = sorted(set_items)
    except TypeError:
        # Esta ordenacion puede no ser adecuada en caso de colisiones de hash
        elementos = sorted(set_items, key=lambda item: hash(item))
    return elementos
#-----------------------------------
# def _sort_items(iterable: typing.Iterable) -> typing.Iterable:
#     try:
#         elementos: typing.Iterable = sorted(iterable)
#     except TypeError:
#         elementos = iterable
#     return elementos
#-----------------------------------------------------------------------
#-- Normalizar Data. ---------------------------------------------------
#-----------------------------------------------------------------------
def _normitem(item: typing.Any,
              prfxtp: bool,
              nrmitm: dict[type, typing.Callable[[typing.Any],typing.Any]],
              stackobjids: set[int]) -> typing.Any:
    """devuelve el item normalizado"""
    if item is None:
        nuevo_item = item
    elif type(item) in nrmitm:
        nitm = nrmitm.get(type(item))
        if nitm is None:
            nuevo_item = item
        else:
            try:
                nuevo_item = nitm(item)
            except Exception as exc:
                #nuevo_item = item
                nuevo_item = f"Error: [{exc!r}]"
    elif isinstance(item, (bool, int, float, complex, str)):
        nuevo_item = item
    elif id(item) in stackobjids:
        # es un objeto recursivo, que se referencia a si mismo
        # se reemplaza por un valor fijo para evitar ciclos infinitos
        # también se podria reemplazar por un codigo hash
        nuevo_item = "objeto#$@recursivo"
    else:
        stackobjids.add(id(item))
        if isinstance(item, tuple):
            nuevo_item = tuple(_normitem(it, prfxtp, nrmitm, stackobjids) for it in item)
        elif isinstance(item, list):
            nuevo_item = list(_normitem(it, prfxtp, nrmitm, stackobjids) for it in item)
        elif isinstance(item, set):
            nuevo_item = list(_normitem(it, prfxtp, nrmitm, stackobjids) for it in _sort_set_items(item))
            if prfxtp:
                nuevo_item = (type(item).__name__, nuevo_item)
        elif isinstance(item, dict):
            nuevo_item = list(_normitem(it, prfxtp, nrmitm, stackobjids) for it in _sort_dict_items(item.items()))
            if prfxtp:
                nuevo_item = (type(item).__name__, nuevo_item)
        elif hasattr(item, "__dict__"):
            nuevo_item = tuple(_normitem(v, prfxtp, nrmitm, stackobjids) for (k,v) in _sort_dict_items(vars(item).items()))
            if prfxtp:
                nuevo_item = (type(item).__name__, nuevo_item)
        else:
            nuevo_item = item
        stackobjids.discard(id(item))
    return nuevo_item    
#-----------------------------------
def normdata(data: typing.Any, *,
             prfxtp: bool = True,
             nrmitm: typing.Optional[dict[type,typing.Callable[[typing.Any], typing.Any]]] = None) -> list:
    """devuelve los datos normalizados. Es de utilidad para comparar
    estructuras de datos con los valores esperados."""
    if nrmitm is None:
        nrmitm = dict()
    if not isinstance(nrmitm, dict):
        raise InternalError(f"normdata.nrmitm not a dict [{type(nrmitm).__name__}]")
    stackobjids: set[int] = set()
    return _normitem(data, prfxtp, nrmitm, stackobjids)
#-----------------------------------------------------------------------
#-- Data. Generar Lista de Tuplas --------------------------------------
#-----------------------------------------------------------------------
def _data2list_item(item: typing.Any,
                    nrmitm: dict[type, typing.Callable[[typing.Any],typing.Any]],
                    stackobjids: set[int]) -> typing.Any:
    """devuelve el item normalizado en lista de tuplas"""
    if item is None:
        nuevo_item = item
    elif type(item) in nrmitm:
        nitm = nrmitm.get(type(item))
        if nitm is None:
            nuevo_item = item
        else:
            try:
                nuevo_item = nitm(item)
            except Exception as exc:
                #nuevo_item = item
                nuevo_item = f"Error: [{exc!r}]"
    elif isinstance(item, (bool, int, float, complex, str)):
        nuevo_item = item
    elif id(item) in stackobjids:
        # es un objeto recursivo, que se referencia a si mismo
        # se reemplaza por un valor fijo para evitar ciclos infinitos
        # también se podria reemplazar por un codigo hash
        nuevo_item = "objeto#$@recursivo"
    else:
        stackobjids.add(id(item))
        if isinstance(item, tuple):
            nuevo_item = tuple(_data2list_item(elem, nrmitm, stackobjids) for elem in item)
        elif isinstance(item, list):
            nuevo_item = list(_data2list_item(elem, nrmitm, stackobjids) for elem in item)
        elif isinstance(item, set):
            nuevo_item = list(_data2list_item(elem, nrmitm, stackobjids) for elem in _sort_set_items(item))
        elif isinstance(item, dict):
            nuevo_item = list()
            ##for (k,v) in _sort_dict_items(item.items()):
            for (k,v) in item.items():  # mantiene el orden original del diccionario
                if isinstance(v, tuple):
                    nuevo_item.append( (_data2list_item(k, nrmitm, stackobjids), _data2list_item(v, nrmitm, stackobjids)) )
                elif isinstance(v, (list, set, dict)):
                    if len(v) == 0:
                        nuevo_item.append( (_data2list_item(k, nrmitm, stackobjids), list()) )
                    else:
                        nuevo_item.extend( (_data2list_item(k, nrmitm, stackobjids), elem) for elem in _data2list_item(v, nrmitm, stackobjids) )
                else:
                    nuevo_item.append( (_data2list_item(k, nrmitm, stackobjids), _data2list_item(v, nrmitm, stackobjids)) )
        elif hasattr(item, "__dict__"):
            ##nuevo_item = tuple(_data2list_item(v, nrmitm, stackobjids) for (k,v) in _sort_dict_items(vars(item).items()))
            nuevo_item = tuple(_data2list_item(v, nrmitm, stackobjids) for (k,v) in vars(item).items()) # mantiene el orden original del diccionario
        else:
            nuevo_item = item
        stackobjids.discard(id(item))
    return nuevo_item    
#-----------------------------------
def data2list(data: typing.Any, *,
              nrmitm: typing.Optional[dict[type, typing.Callable[[typing.Any],typing.Any]]] = None) -> list:
    """devuelve los datos normalizados en lista de tuplas. Es de
    utilidad para comparar estructuras de datos con los valores
    esperados."""
    if nrmitm is None:
        nrmitm = dict()
    if not isinstance(nrmitm, dict):
        raise InternalError(f"normdata.nrmitm not a dict [{type(nrmitm).__name__}]")
    stackobjids: set[int] = set()
    return _data2list_item(data, nrmitm, stackobjids)
#-----------------------------------------------------------------------
#-- Aplanar Data. Generar Lista de Tuplas ---------------------------
#-----------------------------------------------------------------------
def flattendata(data: typing.Any, *,
                level: int = -1) -> list:
    """devuelve una lista aplanada con los elementos de data. Es de
    utilidad para comparar estructuras de datos con los valores
    esperados. En caso de set y dict, los elementos seran
    ordenados. level==0 no se aplana. level negativo, aplana todos los
    niveles. level positivo aplana ese numero de niveles."""
    if isinstance(data, (tuple, list)):
        lista = list()
        for item in data:
            if (level != 0) and isinstance(item, (tuple, list, set, dict)):
                lista.extend(flattendata(item, level=level-1))
            else:
                lista.append(item)
    elif isinstance(data, set):
        lista = list()
        for item in _sort_set_items(data):
            if (level != 0) and isinstance(item, (tuple, list, set, dict)):
                lista.extend(flattendata(item, level=level-1))
            else:
                lista.append(item)
    elif isinstance(data, dict):
        lista = list()
        for (key, value) in _sort_dict_items(data.items()):
            if (level != 0):
                lista.extend(flattendata(key, level=level-1))
                lista.extend(flattendata(value, level=level-1))
                #it0 = flattendata(key, level=level-1)
                #it1 = flattendata(value, level=level-1)
                #lista.append((*it0, *it1))
            else:
                lista.append( (key, value) )
    else:
        lista = [ data ]
    return lista
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-- Mensaje de Error ---------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
# Comparacion simple, no se aplica a los atributos de los objetos
def cmpeq(obj1: typing.Any, obj2: typing.Any, *, quote: bool = True) -> bool:
    if (obj1 is obj2):
        ok = True
    elif ((isinstance(obj1, bool) and isinstance(obj2, bool))
          or (isinstance(obj1, int) and isinstance(obj2, int))):
        ok = (obj1 == obj2)
    elif (isinstance(obj1, (int,float)) and isinstance(obj2, (int,float))):
        ok = math.isclose(obj1, obj2)
    elif not quote and (isinstance(obj1, str) and isinstance(obj2, str)):
        ok = (obj1.strip() == obj2.strip())
    elif ((isinstance(obj1, tuple) and isinstance(obj2, tuple))
          or (isinstance(obj1, list) and isinstance(obj2, list))):
        ok = ((len(obj1) == len(obj2))
              and all(cmpeq(x1, x2, quote=quote) for (x1, x2) in zip(obj1, obj2)))
    elif (isinstance(obj1, set) and isinstance(obj2, set)):
        ok = ((len(obj1) == len(obj2))
              and all(cmpeq(x1, x2, quote=quote) for (x1, x2) in zip(_sort_set_items(obj1), _sort_set_items(obj2))))
    elif (isinstance(obj1, dict) and isinstance(obj2, dict)):
        ok = ((len(obj1) == len(obj2))
              and all(cmpeq(x1, x2, quote=quote) for (x1, x2) in zip(_sort_dict_items(obj1.items()), _sort_dict_items(obj2.items()))))
    else:
        ok = (obj1 == obj2) # compara objetos normalmente
    return ok
#-----------------------------------------------------------------------
def _calcular_diferencias(valor_actual: list[tuple],
                          valor_esperado: list[tuple],
                          *, quote: bool = True) -> tuple[set[int],set[int]]:
    dif1: list[int] = set()
    dif2: list[int] = set()
    menor_len = min(len(valor_actual), len(valor_esperado))
    for idx in range(menor_len):
        if not cmpeq(valor_actual[idx], valor_esperado[idx], quote=quote):
            dif1.add(idx)
            dif2.add(idx)
    dif1 |= set(range(menor_len, len(valor_actual)))
    dif2 |= set(range(menor_len, len(valor_esperado)))
    return (dif1, dif2)
#-----------------------------------------------------------------------
def _ajuste_columnas(lista_tuplas: list[tuple], cabecera: typing.Optional[list[str]] = None) -> None:
    width: list[int] = list()
    just: list[str] = list()
    ncols = 0
    if (len(lista_tuplas) > 0):
        if isinstance(lista_tuplas[0], (tuple,list)):
            ncols = max(ncols, len(lista_tuplas[0]))
        else:
            ncols = max(ncols, 1)
    if ((cabecera is not None) and (len(cabecera) > 0)):
        ncols = max(ncols, len(cabecera))
    if (ncols > 0):
        #-----------------------
        width = [3] * ncols
        just = ["<"] * ncols
        #-----------------------
        if ((cabecera is not None) and (len(cabecera) > 0)):
            for idx, nm in enumerate(cabecera):
                if (idx < ncols):
                    width[idx] = max(width[idx], len(str(nm)))
        #-----------------------
        for elem in lista_tuplas:
            if isinstance(elem, (tuple,list)):
                for idx, nm in enumerate(elem):
                    if (idx < ncols):
                        if isinstance(nm, (int, float)):
                            just[idx] = ">"
                        width[idx] = max(width[idx], len(repr(nm))) # repr cuenta las comillas en caso de str
            else:
                width[0] = max(width[0], len(repr(elem))) # repr cuenta las comillas en caso de str
        #-----------------------
        for idx in range(len(width)):
            width[idx] += 1
        #-----------------------
    return (width, just)
#-----------------------------------------------------------------------
def campo2str(dato: typing.Any, *, quote: bool = True,) -> str:
    if isinstance(dato, str):
        if quote:
            res = f'"{dato}"'
        else:
            res = str(dato)
    else:
        res = repr(dato)
    return res
#-----------------------------------
_COL_SEP = "  "
##_MARCA_DIFF = "<<DIFF>>" ## "*"
def _tabla2str(lista_tuplas: list[tuple],
               cabecera: typing.Optional[list[str]] = None,
               *, quote: bool = True,
               marcar: set[int] = None) -> str:
    tabla: list[str] = list()
    (width, just) = _ajuste_columnas(lista_tuplas, cabecera)
    ncols = len(width)
    if (ncols > 0):
        if ((cabecera is not None) and (len(cabecera) > 0)):
            campos: list[str] = list()
            for idx in range(ncols):
                campos.append(f"{'-'*width[idx]}")
            tabla.append(_COL_SEP.join(campos).rstrip())
            campos.clear()
            for idx, nm in enumerate(cabecera):
                if (idx < ncols):
                    campos.append(f"{nm:{just[idx]}{width[idx]}}")
            tabla.append(_COL_SEP.join(campos).rstrip())
        #-----------------------
        campos: list[str] = list()
        for idx in range(ncols):
            campos.append(f"{'-'*width[idx]}")
        tabla.append(_COL_SEP.join(campos).rstrip())
        #-----------------------
        if len(lista_tuplas) == 0:
            tabla.append(">>> Datos Vacíos <<<")
        else:
            for (idxlinea, elem) in enumerate(lista_tuplas):
                campos: list[str] = list()
                if isinstance(elem, (tuple,list)):
                    for idx, nm in enumerate(elem):
                        if (idx < ncols):
                            campos.append(f"{campo2str(nm, quote=quote):{just[idx]}{width[idx]}}")
                else:
                    campos.append(f"{campo2str(elem, quote=quote):{just[0]}{width[0]}}")
                if ((marcar is not None) and (idxlinea in marcar)):
                    campos.append(f"<<Dif-Línea: {1+idxlinea}>>")
                tabla.append(_COL_SEP.join(campos).rstrip())
        #-----------------------
        campos: list[str] = list()
        for idx in range(ncols):
            campos.append(f"{'-'*width[idx]}")
        tabla.append(_COL_SEP.join(campos).rstrip())
    return "\n".join(tabla)
#-----------------------------------------------------------------------
def _crear_mensaje_error_listas(valor_actual: list[tuple],
                                valor_esperado: list[tuple],
                                *, cabecera: typing.Optional[list[str]] = None,
                                quote: bool = True) -> str:
    msg = ""
    if not isinstance(valor_actual, list):
        msg = f"ERROR INTERNO. Valor actual no es una lista de tuplas [{type(valor_actual).__name__}]"
    elif ((len(valor_actual) > 0)
        and not isinstance(valor_actual[0], (bool,int,float,str,complex,tuple))):
        msg = f"ERROR INTERNO. Valor actual no es una lista de tuplas [{type(valor_actual).__name__}]"
    elif not isinstance(valor_esperado, list):
        msg = f"ERROR INTERNO. Valor esperado no es una lista de tuplas [{type(valor_esperado).__name__}]"
    elif ((len(valor_esperado) > 0)
        and not isinstance(valor_esperado[0], (bool,int,float,str,complex,tuple))):
        msg = f"ERROR INTERNO. Valor esperado no es una lista de tuplas [{type(valor_esperado).__name__}]"
    else:
        (dif1, dif2) = _calcular_diferencias(valor_actual, valor_esperado, quote=quote)
        msglist: list[str] = list()
        msglist.append("")
        msglist.append("-------------")
        msglist.append("VALOR ACTUAL:")
        if cabecera is not None:
            msglist.append("-------------")
        msglist.append(_tabla2str(valor_actual, cabecera=cabecera, quote=quote, marcar=dif1))
        msglist.append("VALOR ESPERADO:")
        if cabecera is not None:
            msglist.append("---------------")
        msglist.append(_tabla2str(valor_esperado, cabecera=cabecera, quote=quote, marcar=dif2))
        msglist.append("")
        msg = "\n".join(msglist)
    return msg
#-----------------------------------------------------------------------
_ACMS = 1
_ACMD = 2
_APAR = 3
_ACOR = 4
_ALLA = 5
#-----------------------------------
_ACAR2SYMBOL = {
    "'": _ACMS,
    '"': _ACMD,
    "(": _APAR,
    "[": _ACOR,
    "{": _ALLA,
}
#-----------------------------------
_CCAR2SYMBOL = {
    "'": _ACMS,
    '"': _ACMD,
    ")": _APAR,
    "]": _ACOR,
    "}": _ALLA,
}
_INDENTSTR = "  "
#-----------------------------------
class StringParser:
    def __init__(self, string: str, *args, **kwargs) -> None:
        self.__string = string
        self.__stack: list[int] = list()
        self.__column: list[int] = list()
        self.__comas: list[int] = list()
        self.__resultado: list[str] = list()
        self.__init_line = True
        self.__curr_column = 0
        super().__init__(*args, **kwargs)

    def __write_indent(self, strfich: io.StringIO, *, incr:int=1) -> None:
        #strfich.write(_INDENTSTR*len(self.__stack))
        #self.__curr_column = len(_INDENTSTR)*len(self.__stack)
        self.__curr_column = self.__column[-1]+incr if len(self.__column) > 0 else 0
        strfich.write(" "*self.__curr_column)
        self.__init_line = True

    def __write_nl_indent_apertura(self, strfich: io.StringIO) -> None:
        strfich.write("\n")
        self.__write_indent(strfich, incr=1)

    def __write_nl_indent_coma(self, strfich: io.StringIO) -> None:
        strfich.write("\n")
        self.__write_indent(strfich, incr=1)

    def __write_nl_indent_cierre(self, strfich: io.StringIO) -> None:
        strfich.write("\n")
        self.__write_indent(strfich, incr=0)
        pass
    
    def apply(self) -> None:
        error = False
        self.__stack.clear()
        self.__column.clear()
        self.__comas.clear()
        self.__resultado.clear()
        self.__init_line = True
        self.__curr_column = 0
        with io.StringIO() as strfich:
            ant = ""
            for (idx, car) in enumerate(self.__string):
                #-------------------
                if ((len(self.__stack) > 0)
                    and (self.__stack[-1] in (_ACMS, _ACMD) )):
                    if (car == "'") and (ant != "\\") and (self.__stack[-1] == _ACMS):
                        self.__stack.pop()  # termina string 'string'
                        self.__column.pop()
                        self.__comas.pop()
                    if (car == '"') and (ant != "\\") and (self.__stack[-1] == _ACMD):
                        self.__stack.pop()  # termina string "string"
                        self.__column.pop()
                        self.__comas.pop()
                elif car in _ACAR2SYMBOL.keys():         # apertura de tupla, lista o dict
                    if ((car in ("[", "{"))
                        and (len(self.__stack) > 0)
                        and (self.__stack[-1] == _APAR)
                        and (self.__comas[-1] > 0)):     # si lista o dict, dentro de tupla, despues de coma
                        self.__write_nl_indent_apertura(strfich)  # -> nueva-linea-indent
                    self.__stack.append( _ACAR2SYMBOL[car] )
                    self.__column.append(self.__curr_column)
                    self.__comas.append(0)
                elif car in _CCAR2SYMBOL.keys():         # cierre tupla, lista o dict
                    if ((len(self.__stack) > 0)
                        and (self.__stack[-1] == _CCAR2SYMBOL[car])):
                        if car in ("]", "}"):                 # si cierre de lista o dict
                            self.__write_nl_indent_cierre(strfich)   #  -> nueva-linea-indent
                        self.__stack.pop()
                        self.__column.pop()
                        self.__comas.pop()
                    else:
                        error = True
                #-------------------
                if not (self.__init_line and (car in (" ", "\t"))):
                    # no escribe espacios al principio de linea
                    # escribe el resto de caracteres
                    strfich.write(car)
                    self.__init_line = False
                    self.__curr_column += 1
                #-------------------
                if car in ("\n", "\r"):           # si ha escrito salto de linea
                    self.__write_indent(strfich)  # -> solo-escribe-indent
                elif ((car in (",", ";"))
                      and (len(self.__stack) > 0)):
                    if (self.__stack[-1] in (_ACOR, _ALLA)): # si coma dentro de lista o dict
                        self.__write_nl_indent_coma(strfich)      # -> nueva-linea-indent
                    if (self.__stack[-1] in (_APAR, _ACOR, _ALLA)):
                        self.__comas[-1] += 1
                #-------------------
                ant = car
            error = error or (len(self.__stack) > 0)
            #if error:
            #    resultado = [self.__string]
            #else:
            resultado = strfich.getvalue()
            resultado = [linea.rstrip() for linea in resultado.splitlines()]
            resultado = [linea for linea in resultado if len(linea) > 0]
        self.__resultado = resultado

    def indent(self, val: int) -> None:
        if val < 0:
            prefix = " "*abs(val)
            for (idx, s) in enumerate(self.__resultado):
                self.__resultado[idx] = s.removeprefix(prefix)
        else:
            prefix = " "*val
            for (idx, s) in enumerate(self.__resultado):
                self.__resultado[idx] = prefix + s

    def getvalue(self) -> list[str]:
        return self.__resultado
#-----------------------------------------------------------------------
def str2reprlista(string: str) -> list[str]:
    string_parser = StringParser(string)
    string_parser.apply()
    return string_parser.getvalue()
#-----------------------------------------------------------------------
def crear_mensaje_error(valor_actual: str|tuple|list[tuple],
                        valor_esperado: str|tuple|list[tuple],
                        *, cabecera: typing.Optional[list[str]] = None,
                        str2repr: bool = False) -> str:
    val_actual = None
    val_esperado = None
    quote = True
    if isinstance(valor_actual, str) and isinstance(valor_esperado, str):
        if str2repr:
            val_actual = str2reprlista(valor_actual)
            val_esperado = str2reprlista(valor_esperado)
            quote = False
        else:
            val_actual = valor_actual.splitlines()
            val_esperado = valor_esperado.splitlines()
            quote = False
    elif isinstance(valor_actual, tuple) and isinstance(valor_esperado, tuple):
        val_actual = [valor_actual]
        val_esperado = [valor_esperado]
    elif isinstance(valor_actual, list) and isinstance(valor_esperado, list):
        val_actual = valor_actual
        val_esperado = valor_esperado
    else:
        val_actual = None
        val_esperado = None
    if (val_actual is None) or (val_esperado is None):
        msg = f"ERROR INTERNO. Tipos de valores no adecuados [{type(valor_actual).__name__}] [{type(valor_esperado).__name__}]"
        raise InternalError(msg)
    else:
        msg = _crear_mensaje_error_listas(val_actual, val_esperado,
                                          cabecera=cabecera,
                                          quote=quote)
    return msg
#-----------------------------------------------------------------------
def _skip_spaces(string: str, idx: int) -> int:
    while ((idx < len(string)) and (string[idx] in " \t")):
        idx += 1
    return idx
# --------------------------------- 
def _skip_newline(string: str, idx: int) -> int:
    if ((idx < len(string)) and (string[idx] in "\r")):
        idx += 1
    if ((idx < len(string)) and (string[idx] in "\n")):
        idx += 1
    return idx
# --------------------------------- 
def norm_input_msg(string: str, input_msg_list: list[str]) -> str:
    string_lower = string.lower()
    iml = [im.strip().removesuffix(":").strip() for im in input_msg_list]
    for im in iml:
        imlw = im.lower()
        idx = string_lower.find(imlw)
        while idx >= 0:
            endline = "\n"
            idx = idx + len(imlw)
            nidx = _skip_spaces(string_lower, idx)
            if ((nidx < len(string_lower)) and (string_lower[nidx] in ":")):
                nidx += 1
                endline = ":\n"
            nidx = _skip_spaces(string_lower, nidx)
            nidx = _skip_newline(string_lower, nidx)
            string_lower = string_lower[:idx] + endline + string_lower[nidx:]
            string = string[:idx] + endline + string[nidx:]
            idx = string_lower.find(imlw, idx+len(endline))
    return string
# --------------------------------------------------------------------- 
# -- CheckType -------------------------------------------------------- 
# ---------------------------------------------------------------------
def check_type(obj: object,
               typeanot: type|types.GenericAlias) -> typing.Optional[str]:
    error_msg: typing.Optional[str] = None
    if typeanot is typing.Any:
        pass # OK obj es del tipo esperado
    elif type(typeanot) is type:
        if not isinstance(obj, typeanot):
            error_msg = f"*Tipo '{type(obj).__name__}' distinto del esperado '{typeanot.__name__}'."
        pass # OK obj es del tipo esperado
    elif (isinstance(typeanot, types.UnionType)
          and (typing.get_origin(typeanot) is types.UnionType)
          and (len(typing.get_args(typeanot)) > 1)):
        if not any(check_type(obj, t) is None for t in typing.get_args(typeanot)):
            error_msg = f"*Tipo '{type(obj).__name__}' distinto del esperado '{typeanot}'."
        pass # OK obj es del tipo esperado    
    elif ((not isinstance(typeanot, types.UnionType))
          and (typing.get_origin(typeanot) is typing.Union)
          and (len(typing.get_args(typeanot)) > 1)
          and (type(None) in typing.get_args(typeanot))):
        if obj is not None:
            if not any(check_type(obj, t) is None for t in typing.get_args(typeanot) if t is not type(None)):
                error_msg = f"*Tipo '{type(obj).__name__}' distinto del esperado '{typeanot}'."
        pass # OK obj es del tipo esperado        
    elif isinstance(typeanot, types.GenericAlias):
        origin_type = typing.get_origin(typeanot)
        args_types = typing.get_args(typeanot)
        if type(origin_type) is type:
            if isinstance(obj, origin_type):
                if type(obj) is dict:
                    if len(obj) > 0:
                        errmsg1 = check_type(list(obj.keys()), list[args_types[0]])
                        errmsg2 = check_type(list(obj.values()), list[args_types[1]])
                        errmsgs = {errmsg1, errmsg2}
                        error_msg = "\n".join(x for x in errmsgs if x)
                    pass
                elif ((type(obj) is list) or (type(obj) is set)):
                    if len(obj) > 0:
                        errmsgs = {check_type(x, args_types[0]) for x in obj}
                        error_msg = "\n".join(x for x in errmsgs if x)
                    pass
                elif type(obj) is tuple:
                    if len(obj) != len(args_types):
                        error_msg = f"*Cantidad de elementos de tupla [{len(obj)}] distinto del esperado [{len(args_types)}]."
                    elif len(obj) > 0:
                        errmsgs = {check_type(x, t) for (x, t) in zip(obj, args_types)}
                        error_msg = "\n".join(x for x in errmsgs if x)
                    pass
                pass # OK obj es del tipo esperado
            else:
                error_msg = f"*Tipo '{type(obj).__name__}' distinto del esperado '{typeanot}'"
        else:
            raise InternalError(f"InternalError: check_type unexpected type [{origin_type}] [{typeanot}]")
    else:
        raise InternalError(f"InternalError: check_type bad arg type [{type(typeanot).__name__}]")
    return error_msg if error_msg else None
# --------------------------------------------------------------------- 
# -- checkEqual ------------------------------------------------------- 
# ---------------------------------------------------------------------
def check_cmpeq(actual: object,
                esperado: object,
                *,
                cabecera: typing.Optional[list[str]] = None) -> typing.Optional[str]:
    error_msg = None
    if not cmpeq(actual, esperado):
        error_msg = crear_mensaje_error(actual,
                                        esperado,
                                        cabecera=cabecera)
    return error_msg if error_msg else None
# --------------------------------------------------------------------- 
def check_equal(obj: object,
                typeanot: type|types.GenericAlias,
                esperado: object,
                *,
                cabecera: typing.Optional[list[str]] = None,
                nrmitm: typing.Optional[dict[type, typing.Callable[[typing.Any],typing.Any]]] = None) -> typing.Optional[str]:
    error_msg = check_type(obj, typeanot)
    if error_msg is None:
        obj_norm = data2list(obj, nrmitm)
        esperado_norm = data2list(esperado, nrmitm)
        if not cmpeq(obj_norm, esperado_norm):
            error_msg = crear_mensaje_error(obj_norm,
                                            esperado_norm,
                                            cabecera=cabecera)
    return error_msg if error_msg else None
#-----------------------------------------------------------------------
#-- String transformation ----------------------------------------------
#-----------------------------------------------------------------------
_CHARMAP = {
    #----
    "\n": " ",      # newline
    "\r": " ",      # return
    "\t": " ",      # tabulator
    "\f": " ",      # form-feed
    "\u20AC": "$",  #  €
    "\u03BC": "@",  #  µ
    #----
    "\u00A0": " ",  #  space
    "\u00A1": "!",  #  ¡
    "\u00A2": "$",  #  ¢
    "\u00A3": "$",  #  £
    "\u00A4": "#",  #  ¤
    "\u00A5": "$",  #  ¥
    "\u00A6": "|",  #  ¦
    "\u00A7": "$",  #  §
    "\u00A8": '"',  #  ¨
    "\u00A9": "@",  #  ©
    "\u00AA": "@",  #  ª
    "\u00AB": "<",  #  «
    "\u00AC": "~",  #  ¬
    "\u00AD": "-",  #  ­
    "\u00AE": "@",  #  ®
    "\u00AF": "-",  #  ¯
    #----
    "\u00B0": "@",  #  °
    "\u00B1": "#",  #  ±
    "\u00B2": "#",  #  ²
    "\u00B3": "#",  #  ³
    "\u00B4": "'",  #  ´
    "\u00B5": "@",  #  µ
    "\u00B6": "$",  #  ¶
    "\u00B7": ".",  #  ·
    "\u00B8": ",",  #  ¸
    "\u00B9": "#",  #  ¹
    "\u00BA": "@",  #  º
    "\u00BB": ">",  #  »
    "\u00BC": "#",  #  ¼
    "\u00BD": "#",  #  ½
    "\u00BE": "#",  #  ¾
    "\u00BF": "?",  #  ¿ 
    #----
    "\u00C0": "A",  #  À
    "\u00C1": "A",  #  Á
    "\u00C2": "A",  #  Â
    "\u00C3": "A",  #  Ã
    "\u00C4": "A",  #  Ä
    "\u00C5": "A",  #  Å
    "\u00C6": "A",  #  Æ
    "\u00C7": "C",  #  Ç
    "\u00C8": "E",  #  È
    "\u00C9": "E",  #  É
    "\u00CA": "E",  #  Ê
    "\u00CB": "E",  #  Ë
    "\u00CC": "I",  #  Ì
    "\u00CD": "I",  #  Í
    "\u00CE": "I",  #  Î
    "\u00CF": "I",  #  Ï
    #----
    "\u00D0": "D",  #  Ð
    "\u00D1": "N",  #  Ñ
    "\u00D2": "O",  #  Ò
    "\u00D3": "O",  #  Ó
    "\u00D4": "O",  #  Ô
    "\u00D5": "O",  #  Õ
    "\u00D6": "O",  #  Ö
    "\u00D7": "*",  #  ×
    "\u00D8": "#",  #  Ø
    "\u00D9": "U",  #  Ù
    "\u00DA": "U",  #  Ú
    "\u00DB": "U",  #  Û
    "\u00DC": "U",  #  Ü
    "\u00DD": "Y",  #  Ý
    "\u00DE": "Z",  #  Þ
    "\u00DF": "S",  #  ß
    #----
    "\u00E0": "a",  #  à
    "\u00E1": "a",  #  á
    "\u00E2": "a",  #  â
    "\u00E3": "a",  #  ã
    "\u00E4": "a",  #  ä
    "\u00E5": "a",  #  å
    "\u00E6": "a",  #  æ
    "\u00E7": "c",  #  ç
    "\u00E8": "e",  #  è
    "\u00E9": "e",  #  é
    "\u00EA": "e",  #  ê
    "\u00EB": "e",  #  ë
    "\u00EC": "i",  #  ì
    "\u00ED": "i",  #  í
    "\u00EE": "i",  #  î
    "\u00EF": "i",  #  ï
    #----
    "\u00F0": "d",  #  ð
    "\u00F1": "n",  #  ñ
    "\u00F2": "o",  #  ò
    "\u00F3": "o",  #  ó
    "\u00F4": "o",  #  ô
    "\u00F5": "o",  #  õ
    "\u00F6": "o",  #  ö
    "\u00F7": "/",  #  ÷
    "\u00F8": "#",  #  ø
    "\u00F9": "u",  #  ù
    "\u00FA": "u",  #  ú
    "\u00FB": "u",  #  û
    "\u00FC": "u",  #  ü
    "\u00FD": "y",  #  ý
    "\u00FE": "z",  #  þ
    "\u00FF": "y",  #  ÿ
}
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
def strstrip(linea: str, stripmode: str) -> str:
    if stripmode == "rstrip":
        resultado = linea.rstrip()
    elif stripmode == "lstrip":
        resultado = linea.lstrip()
    elif stripmode == "strip":
        resultado = linea.strip()
    else:
        resultado = linea
    return resultado
#-----------------------------------------------------------------------
def str2normsp(string: str, *,
               sp: typing.Optional[str] = None,
               nl: typing.Optional[str] = None,
               stripmode: str = "rstrip") -> str:
    """Devuelve el string con espacios normalizados.
    Cada línea rstrip espacios según arg STRIPMODE.
    Reemplaza espacios por arg SP.
    Reemplaza saltos de linea por arg NL."""
    if isinstance(nl, str):
        nlsymbol = nl
    else:
        nlsymbol = "\n"
    if isinstance(sp, str):
        spsymbol = sp
    else:
        spsymbol = " "
    return nlsymbol.join([strstrip(linea, stripmode).replace(" ", spsymbol) for linea in string.splitlines()]) + nlsymbol
#-----------------------------------------------------------------------
def str2ascii(string: str) -> str:
    """convierte un string a caracteres ascii"""
    res = string
    if isinstance(string, str):
        string = unicodedata.normalize("NFKC", string)
        with io.StringIO() as strmanip:
            for ch in string:
                ch2 = _CHARMAP.get(ch, ch)
                if ((ord(ch2) < ord(" ")) or (ord(ch2) > ord("~"))):
                    if (ord(ch2) in {768, 769, 770, 771, 772, 776, 778, 807}):
                        ch2 = ""
                    else:
                        ch2 = " "
                strmanip.write(ch2)
            res = strmanip.getvalue()
    return res
#-----------------------------------------------------------------------
def str2lower(string: str) -> str:
    """convierte un string a lower-case"""
    res = string
    if isinstance(string, str):
        res = string.lower()
    return res
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
# https://docs.python.org/3/library/re.html#writing-a-tokenizer
def _tokenize_string(string):
    token_specification = [
        ( "TOKEN_NEWLINE", r'\n' ),
        ( "TOKEN_SKIP", r'[ \t]+' ),
        ( "TOKEN_LETTER", r'[A-Za-zÁÉÍÓÚÜÑÇáéíóúüñç]+' ),
        ( "TOKEN_NUMBER", r'([-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)' ),
        ( "TOKEN_OTHER", r'.'),            # Any other character
    ]
    #tok_regex = '|'.join(f"(?P<{pair[0]}>{pair[1]})" for pair in token_specification)
    tok_regex = '|'.join('(?P<%s>%s)' % pair for pair in token_specification)
    #scan_regex = re.compile(tok_regex, flags=re.MULTILINE)
    scan_regex = re.compile(tok_regex, flags=0)
    for mo in scan_regex.finditer(string):
        kind = mo.lastgroup
        value = mo.group()
        if ((kind != 'TOKEN_NEWLINE') and (kind != "TOKEN_SKIP")):
            if kind == "TOKEN_NUMBER":
                if (('e' in value)or('E' in value)):
                    #value = str(round(float(value), 7)) # formato punto fijo
                    value = f"{float(value):.6e}"
                elif ('.' in value):
                    #value = str(round(float(value), 7)) # formato punto fijo
                    value = f"{float(value):.6f}"
            yield value
    return
#-----------------------------------------------------------------------
def _buscar_sublista(lista: list[int], sublista: list[int], inicio: int = 0) -> int:
    len_sublista = len(sublista)
    if (0 < len_sublista <= len(lista)-inicio):
        if len_sublista == 1:
            idx = lista.index(sublista[0], inicio)
        else:
            idx = inicio-1
            encontrado = False
            while not encontrado:
                idx = lista.index(sublista[0], idx+1)
                encontrado = (sublista == lista[idx:idx+len_sublista])
    else:
        raise InternalError("sublist is not in list")
    return idx
#-----------------------------------------------------------------------
# def _sort_regions(tkstr, sort_begin: str, sort_end: str) -> list[str]:
#     sort_begin = next(_tokenize_string(sort_begin)) # el primer token
#     sort_end = next(_tokenize_string(sort_end))     # el primer token
#     #-------------------------------
#     lista_tkstr = list(tkstr)
#     try:
#         idx1 = lista_tkstr.index(sort_begin)
#         idx2 = lista_tkstr.index(sort_end, idx1+1)
#         while ((idx1 >= 0) and (idx2 >= 0)):
#             lista_tkstr[idx1+1:idx2] = sorted(lista_tkstr[idx1+1:idx2])
#             idx1 = lista_tkstr.index(sort_begin, idx2+1)
#             idx2 = lista_tkstr.index(sort_end, idx1+1)
#     except ValueError as exc:
#         pass # idx1 o idx2 no encontrado, terminar procesamiento
#     return lista_tkstr
#-----------------------------------
# def _sort_regions(tkstr, sort_begin: str, sort_end: str) -> list[str]:
#     sort_begin = next(_tokenize_string(sort_begin)) # el primer token
#     sort_end = next(_tokenize_string(sort_end))     # el primer token
#     #-------------------------------
#     lista_tkstr = list(tkstr)
#     try:
#         idx2 = -1
#         while True:
#             idx1 = lista_tkstr.index(sort_begin, idx2+1)
#             idx2 = lista_tkstr.index(sort_end, idx1+1)
#             lista_tkstr[idx1+1:idx2] = sorted(lista_tkstr[idx1+1:idx2])
#     except ValueError as exc:
#         pass # idx1 o idx2 no encontrado, terminar procesamiento
#     return lista_tkstr
#-----------------------------------
def _sort_regions(tkstr, sort_begin: str, sort_end: str) -> list[str]:
    sort_begin = list(_tokenize_string(sort_begin))
    sort_end = list(_tokenize_string(sort_end))
    lista_tkstr = list(tkstr)
    len_sort_begin = len(sort_begin)
    len_sort_end = len(sort_end)
    try:
        idx2 = -len_sort_end
        while True:
            idx1 = _buscar_sublista(lista_tkstr, sort_begin, idx2+len_sort_end)
            idx2 = _buscar_sublista(lista_tkstr, sort_end, idx1+len_sort_begin)
            lista_tkstr[idx1+len_sort_begin:idx2] = sorted(lista_tkstr[idx1+len_sort_begin:idx2])
    except ValueError as exc:
        pass # idx1 o idx2 no encontrado, terminar procesamiento
    return lista_tkstr
#-----------------------------------------------------------------------
# def str2tk(string: str) -> str:
#     """convierte un string a tokens (normaliza separadores)"""
#     res = string
#     if isinstance(string, str):
#         res = " ".join(_tokenize_string(string))
#     return res
#-----------------------------------------------------------------------
def _isnumber(string: str) -> bool:
    return ((len(string) > 0)
            and((string[0].isdecimal())
                or (string[0] == '-' and (len(string) > 1) and string[1].isdecimal())))
#-----------------------------------------------------------------------
def _isalphanumber(string: str) -> bool:
    return ((len(string) > 0)
            and((string[0].isalnum())
                or (string[0] == '-' and (len(string) > 1) and string[1].isdecimal())))
#-----------------------------------------------------------------------
def str2tk(string: str, *,
           lower: bool = None,           # convert strings to lower-case
           cnvt_ascii: bool = None,      # convert strings to ascii
           rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
           rem_nnum: bool = None,        # remove all not number tokens
           rem_in: str = None,           # remove tokens in rem_in
           rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
           rem_nin: str = None,          # remove tokens not in rem_nin
           sort_all: bool = None,        # sort all tokens
           sort_begin: str = None,       # sorted region beginning token
           sort_end: str = None) -> str: # sorted region ending token
    """convierte un string a tokens (normaliza separadores).
    - lower: si True entonces convierte string a lower-case.
    - cnvt_ascii: si True entonces convierte string a ascii.
    - rem_nalnum: keep alpha&numbers, remove others
    - rem_nnum: si True entonces elimina los no-números.
    - rem_in: elimina los tokens en rem_in.
    - rem_ninkn: elimina tokens no-en rem_ninkn, pero mantiene los numeros
    - rem_nin: elimina tokens no-en rem_nin
    - sort_all: sort all tokens
    - sort_begin: sorted region beginning token
    - sort_end: sorted region ending token
      token regions among sort_begin and sort_end will be sorted. This
      is useful when comparing sets
      region sorting is carried-out before any token removal
    """
    res = string
    if isinstance(string, str):
        #---------------------------
        if cnvt_ascii is True:
            string = str2ascii(string)
            rem_in = str2ascii(rem_in)
            rem_ninkn = str2ascii(rem_ninkn)
            rem_nin = str2ascii(rem_nin)
            sort_begin = str2ascii(sort_begin)
            sort_end = str2ascii(sort_end)
        #---------------------------
        if lower is True:
            string = str2lower(string)
            rem_in = str2lower(rem_in)
            rem_ninkn = str2lower(rem_ninkn)
            rem_nin = str2lower(rem_nin)
            sort_begin = str2lower(sort_begin)
            sort_end = str2lower(sort_end)
        #---------------------------
        tkstr = _tokenize_string(string)
        #---------------------------
        if sort_all:
            tkstr = sorted(tkstr)
        elif ((sort_begin is not None) and (sort_end is not None)):
            tkstr = _sort_regions(tkstr, sort_begin, sort_end)
        #---------------------------
        if rem_nnum is True:
            tkstr = (tk for tk in tkstr if _isnumber(tk))
        elif rem_nalnum is True:
            tkstr = (tk for tk in tkstr if _isalphanumber(tk))
        #---------------------------
        if (isinstance(rem_in, str) and (len(rem_in) > 0)):
            tkremin = set(_tokenize_string(rem_in))
            if (len(tkremin) > 0):
                tkstr = (tk for tk in tkstr if tk not in tkremin)
        if (isinstance(rem_ninkn, str) and (len(rem_ninkn) > 0)):
            tkkpin = set(_tokenize_string(rem_ninkn))
            if (len(tkkpin) > 0):
                tkstr = (tk for tk in tkstr if ((_isnumber(tk))or(tk in tkkpin)))
        if (isinstance(rem_nin, str) and (len(rem_nin) > 0)):
            tkkpin = set(_tokenize_string(rem_nin))
            if (len(tkkpin) > 0):
                tkstr = (tk for tk in tkstr if (tk in tkkpin))
        res = " ".join(tkstr)
    return res
#-----------------------------------------------------------------------
def str2tkref(string: str, reference: str, *,
              lower: bool = None,           # convert strings to lower-case
              cnvt_ascii: bool = None,      # convert strings to ascii
              rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
              rem_nnum: bool = None,        # remove all not number tokens
              rem_in: str = None,           # remove tokens in rem_in
              rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
              rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
              sort_all: bool = None,        # sort all tokens
              sort_begin: str = None,       # sorted region beginning token
              sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    """convierte un string y reference a tokens (normaliza separadores).
    - lower: si True entonces convierte string a lower-case.
    - cnvt_ascii: si True entonces convierte string a ascii.
    - rem_nalnum: keep alpha&numbers, remove others
    - rem_nnum: si True entonces elimina los no-números.
    - rem_in: elimina los tokens en rem_in.
    - rem_ninkn: elimina tokens no-en rem_ninkn, pero mantiene los numeros (si existe, añade str2tk(reference))
    - rem_nin: elimina tokens no-en rem_nin (si existe, añade str2tk(reference))
    - sort_all: sort all tokens
    - sort_begin: sorted region beginning token
    - sort_end: sorted region ending token
      token regions among sort_begin and sort_end will be sorted. This
      is useful when comparing sets
      region sorting is carried-out before any token removal
    """
    if (isinstance(rem_ninkn, str)):
        rem_ninkn += " " + reference
    if (isinstance(rem_nin, str)):
        rem_nin += " " + reference
    new_ref = str2tk(reference,
                     lower=lower,
                     cnvt_ascii=cnvt_ascii,
                     rem_nalnum=rem_nalnum,
                     rem_nnum=rem_nnum,
                     rem_in=rem_in,
                     rem_ninkn=rem_ninkn,
                     rem_nin=rem_nin,
                     sort_all=sort_all,
                     sort_begin=sort_begin,
                     sort_end=sort_end)
    new_str = str2tk(string,
                     lower=lower,
                     cnvt_ascii=cnvt_ascii,
                     rem_nalnum=rem_nalnum,
                     rem_nnum=rem_nnum,
                     rem_in=rem_in,
                     rem_ninkn=rem_ninkn,
                     rem_nin=rem_nin,
                     sort_all=sort_all,
                     sort_begin=sort_begin,
                     sort_end=sort_end)
    return (new_str, new_ref)
#-----------------------------------------------------------------------
def str2tknumber(string: str, *,
                 rem_in: str = None,           # remove tokens in rem_in
                 rem_nin: str = None,          # remove tokens not in rem_nin
                 sort_all: bool = None,        # sort all tokens
                 sort_begin: str = None,       # sorted region beginning token
                 sort_end: str = None) -> str: # sorted region ending token
    """convierte un string a tokens de números (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_nin"""
    return str2tk(string,
                  rem_nnum=True,
                  rem_in=rem_in,
                  rem_nin=rem_nin,
                  sort_all=sort_all,
                  sort_begin=sort_begin,
                  sort_end=sort_end)
#-----------------------------------------------------------------------
def str2tknumberref(string: str, reference: str, *,
                    rem_in: str = None,           # remove tokens in rem_in
                    rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                    sort_all: bool = None,        # sort all tokens
                    sort_begin: str = None,       # sorted region beginning token
                    sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    """convierte un string y referencia a tokens de números (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_nin"""
    return str2tkref(string, reference,
                     rem_nnum=True,
                     rem_in=rem_in,
                     rem_nin=rem_nin,
                     sort_all=sort_all,
                     sort_begin=sort_begin,
                     sort_end=sort_end)
#-----------------------------------------------------------------------
def str2tkascii(string: str, *,
                lower: bool = None,           # convert strings to lower-case
                rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
                rem_in: str = None,           # remove tokens in rem_in
                rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
                rem_nin: str = None,          # remove tokens not in rem_nin
                sort_all: bool = None,        # sort all tokens
                sort_begin: str = None,       # sorted region beginning token
                sort_end: str = None) -> str: # sorted region ending token
    """convierte un string a tokens ascii (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_ninkn (mantiene numeros). Elimina token not in rem_nin"""
    return str2tk(string,
                  lower=lower,
                  cnvt_ascii=True,
                  rem_nalnum=rem_nalnum,
                  rem_in=rem_in,
                  rem_ninkn=rem_ninkn,
                  rem_nin=rem_nin,
                  sort_all=sort_all,
                  sort_begin=sort_begin,
                  sort_end=sort_end)
#-----------------------------------------------------------------------
def str2tkasciiref(string: str, reference: str, *,
                   lower: bool = None,           # convert strings to lower-case
                   rem_nalnum: bool = None,      # remove all not alpha&numbers tokens
                   rem_in: str = None,           # remove tokens in rem_in
                   rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
                   rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                   sort_all: bool = None,        # sort all tokens
                   sort_begin: str = None,       # sorted region beginning token
                   sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    """convierte un string y referencia a tokens ascii (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_ninkn (mantiene numeros). Elimina token not in rem_nin"""
    return str2tkref(string, reference,
                     lower=lower,
                     cnvt_ascii=True,
                     rem_nalnum=rem_nalnum,
                     rem_in=rem_in,
                     rem_ninkn=rem_ninkn,
                     rem_nin=rem_nin,
                     sort_all=sort_all,
                     sort_begin=sort_begin,
                     sort_end=sort_end)
#-----------------------------------------------------------------------
def str2tkalnum(string: str, *,
                lower: bool = None,           # convert strings to lower-case
                rem_in: str = None,           # remove tokens in rem_in
                rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers
                rem_nin: str = None,          # remove tokens not in rem_nin
                sort_all: bool = None,        # sort all tokens
                sort_begin: str = None,       # sorted region beginning token
                sort_end: str = None) -> str: # sorted region ending token
    """convierte un string a tokens alpha-ascii&numbers (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_ninkn (mantiene numeros). Elimina token not in rem_nin"""
    return str2tk(string,
                  lower=lower,
                  cnvt_ascii=True,
                  rem_nalnum=True,
                  rem_in=rem_in,
                  rem_ninkn=rem_ninkn,
                  rem_nin=rem_nin,
                  sort_all=sort_all,
                  sort_begin=sort_begin,
                  sort_end=sort_end)
#-----------------------------------------------------------------------
def str2tkalnumref(string: str, reference: str, *,
                   lower: bool = None,           # convert strings to lower-case
                   rem_in: str = None,           # remove tokens in rem_in
                   rem_ninkn: str = None,        # remove tokens not in rem_ninkn, but keep numbers (si existe, añade str2tk(reference))
                   rem_nin: str = None,          # remove tokens not in rem_nin (si existe, añade str2tk(reference))
                   sort_all: bool = None,        # sort all tokens
                   sort_begin: str = None,       # sorted region beginning token
                   sort_end: str = None) -> tuple[str,str]: # sorted region ending token
    """convierte un string y referencia a tokens alpha-ascii&numbers (normaliza
    separadores). Elimina token in rem_in. Elimina token not in
    rem_ninkn (mantiene numeros). Elimina token not in rem_nin"""
    return str2tkref(string, reference,
                     lower=lower,
                     cnvt_ascii=True,
                     rem_nalnum=True,
                     rem_in=rem_in,
                     rem_ninkn=rem_ninkn,
                     rem_nin=rem_nin,
                     sort_all=sort_all,
                     sort_begin=sort_begin,
                     sort_end=sort_end)
#-----------------------------------------------------------------------
#-- Operaciones con ficheros -------------------------------------------
#-----------------------------------------------------------------------
def file2str(filename: str) -> str:
    try:
        with open(os.path.normpath(filename), "r", encoding="utf-8") as file:
            res = file.read()
    except (ValueError, OSError) as exc:
        res = repr(exc)
    return res
#-----------------------------------
def str2file(filename: str, contenido: str) -> bool:
    try:
        res = False
        with open(os.path.normpath(filename), "w", encoding="utf-8") as file:
            file.write(contenido)
            if ((len(contenido) > 0) and (contenido[-1] != "\n")):
                file.write("\n")
        res = True
    except (ValueError, OSError) as exc:
        res = False
    return res
#-----------------------------------
def remove_file(filename: str) -> bool:
    try:
        res = False
        os.remove(filename)
    except (ValueError, OSError) as exc:
        res = False
    else:
        res = True
    return res
#-----------------------------------------------------------------------
#-- Class IOCapture ContextManager -------------------------------------
#-----------------------------------------------------------------------
class IOCapture:
    """Captura sys.stdout, sys.stderr y sys.stdin"""
    def __init__(self, invalue: typing.Optional[str] = None, *args, **kwargs) -> None:
        """recibe el valor inicial para sys.stdin"""
        self.__invalue = invalue
        if not isinstance(self.__invalue, str):
            self.__invalue = ""
        if not self.__invalue.endswith('\n'):
            self.__invalue += '\n'
        self.__stdin_org = sys.stdin
        self.__stdout_org = sys.stdout
        self.__stderr_org = sys.stderr
        self.__stdin: typing.Optional[io.StringIO] = None
        self.__stdout: typing.Optional[io.StringIO] = None
        self.__stderr: typing.Optional[io.StringIO] = None
        self.__stdout_value: typing.Optional[str] = None
        self.__stderr_value: typing.Optional[str] = None
        super().__init__(*args, **kwargs)
    
    def __enter__(self) -> 'IOCapture':
        self.__stdout_value = None
        self.__stderr_value = None
        self.__stdin = io.StringIO(self.__invalue)
        self.__stdout = io.StringIO()
        self.__stderr = io.StringIO()
        
        sys.stdin = self.__stdin
        sys.stdout = self.__stdout
        sys.stderr = self.__stderr
        
        return self

    def __exit__(self, exc_type, exc_value, exc_tb) -> None:
        sys.stdin = self.__stdin_org
        sys.stdout = self.__stdout_org
        sys.stderr = self.__stderr_org

        self.__stdout_value = self.__stdout.getvalue()
        self.__stderr_value = self.__stderr.getvalue()

        self.__stdin.close()
        self.__stdout.close()
        self.__stderr.close()
        
        del self.__stdin    # release memory
        del self.__stdout   # release memory
        del self.__stderr   # release memory

        return None

    def get_stdout_value(self) -> typing.Optional[str]:
        """devuelve el string capturado de sys.stdout"""
        return self.__stdout_value
    
    def get_stderr_value(self) -> typing.Optional[str]:
        """devuelve el string capturado de sys.stderr"""
        return self.__stderr_value
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
