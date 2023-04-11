const loadbalancer = {}

loadbalancer.ROUND_RUBIN = (service) => {
    const newIndex = ++service.index >= service.instances.length ? 0 : service.index
    service.index = newIndex
    return loadbalancer.isEnabled(service, newIndex, loadbalancer.ROUND_RUBIN)
}

loadbalancer.isEnabled = (service, index, loadBalancerStrategy) => {
    return service.instances[index].enabled ? index : loadBalancerStrategy(service)
}

module.exports = loadbalancer
