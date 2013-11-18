from pyramid.view import view_config
from smapx_data import *

@view_config(route_name='index', renderer='index.mako')
def v_index(request):
    return {'project': 'SMAPExplorer'}
    
    
@view_config(route_name='data', renderer='json')
def v_data(request):
    for e in ["starttime", "endtime", "unit", "resampleto"]:
        if e not in request.GET:
            request.response.status = 400
            return {'status':'error','message':'expected field %s'%e}
    try:
        rv = get_smapx_data(request.GET["starttime"],
                            request.GET["endtime"],
                            request.GET["unit"],
                            request.GET["resampleto"])
        return rv
    except Exception as e:
        request.response.status = 400
        return {'status':'error', 'message':str(e)}
