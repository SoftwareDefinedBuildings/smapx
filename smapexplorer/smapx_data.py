import numpy as np
import math                            
class SMAPXexception (Exception):
    pass
                                
def get_smapx_data(starttime, endtime, unit, resampleto):
    #Validate inputs
    if unit not in ["ns","us","ms","s"]:
        raise SMAPXexception("invalid unit of time")
    try:
        starttime = int(starttime)
        endtime = int(endtime)
        resampleto = int(resampleto)
        assert starttime >= 0
        assert endtime >= 0
        assert resampleto > 0
        assert endtime > starttime
        #TODO also check that times are sane given units
    except Exception as e:
        print "Bad request: ", e
        raise SMAPXexception("bad parameters")
    
    #Our data function
    def f(t):
        t = float(t) #Add scale here if required
        return 100*math.sin(t/100) + 10*math.sin(t/10) + 5*math.sin(t) + math.sin(10*t)
    rv = []
    ival = (endtime-starttime) / resampleto
    for i in xrange(starttime, endtime, ival):
        #We are imitating final data structure
        # max, min, mean, count
        krv = []
        for k in xrange(i, i+ival, 1):
            krv.append(f(k))
        tm = i + ival/2.
        e = {"max":max(krv), "min":min(krv), "mean":np.mean(krv), "count": ival, "mt": tm, "tw": ival/2}
        rv.append(e)
    return rv
    
                                    
