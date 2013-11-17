from pyramid.view import view_config

@view_config(route_name='index', renderer='index.mako')
def v_index(request):
    return {'project': 'SMAPExplorer'}
