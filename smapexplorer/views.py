from pyramid.view import view_config

@view_config(route_name='index', renderer='index.mako')
def v_index(request):
    return {'project': 'SMAPExplorer'}
    
    
@view_config(route_name='data', renderer='json')
def v_data(request):
    print request.GET
    print request.POST
    return {'data':range(50)}
