import { describe, it, expect, vi } from 'vitest';
import { chartHandler } from '../src/stores'
import { NOPARENT_STRING } from '../src/constants';

describe('Get Parent ID', () => {
    it('Should get correct parent ID after adding child chart', async () => {
        let addChartData = chartHandler.addNewChart()
        let parentId = addChartData.nodeObject.id
        expect(parentId = "0")
        expect(chartHandler.getParentId(parentId) === NOPARENT_STRING)

        let childAddChartData = chartHandler.addChildChart("0", {x: 100, y: 100})
        let childId = childAddChartData.nodeObject.id
        expect(childId = "1")
        expect(chartHandler.getParentId(childId) === parentId)
    })
})