import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../services/user';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule, FormsModule ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  recentEmployees: User[] = [];

  // Chart state
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  chartWidth = 600;
  chartHeight = 400;

  chartData: ChartData<any> = {
    labels: [],
    datasets: [
      {
        label: 'Employees per Department',
        data: [],
        backgroundColor: [
          '#3b82f6', '#facc15', '#22c55e', '#ef4444', '#8b5cf6', '#f87171', '#34d399'
        ]
      }
    ]
  };

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { font: { weight: 'bold', size: 14 }, color: '#111827' } },
      tooltip: { titleFont: { weight: 'bold', size: 14 }, bodyFont: { weight: 'bold', size: 12 }, titleColor: '#111827', bodyColor: '#111827' }
    },
    scales: {
      x: { ticks: { font: { weight: 'bold', size: 12 }, color: '#111827' } },
      y: { ticks: { font: { weight: 'bold', size: 12 }, color: '#111827' } }
    }
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadMetrics();

    // Observe theme changes and update chart colors automatically
    const observer = new MutationObserver(() => this.updateChartColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  goToUserDetails(userId: string) {
    this.router.navigate(['/users/view', userId]);
  }

  loadMetrics() {
    // Load all employees for chart
    this.userService.getAll(1, 1000, '').subscribe((res: any) => {
      this.totalEmployees = res.total;

      const deptCount: { [key: string]: number } = {};
      res.users.forEach((user: User) => {
        const dept = user.department || 'Unknown';
        deptCount[dept] = (deptCount[dept] || 0) + 1;
      });

      this.chartData = {
        labels: Object.keys(deptCount),
        datasets: [
          {
            label: 'Employees per Department',
            data: Object.values(deptCount),
            backgroundColor: [
              '#3b82f6', '#facc15', '#22c55e', '#ef4444', '#8b5cf6', '#f87171', '#34d399'
            ]
          }
        ]
      };

      // Update chart colors after setting data
      this.updateChartColors();
    });

    // Load 5 recent employees for table
    this.userService.getAll(1, 5, '').subscribe((res: any) => {
      this.recentEmployees = res.users;
    });
    this.updateChartColors();
  }

  // 🔹 Update chart text colors according to theme
  updateChartColors() {
  const isDark = document.documentElement.classList.contains('dark');

  if (this.chartOptions.plugins && this.chartOptions.plugins.legend && this.chartOptions.plugins.tooltip && this.chartOptions.scales) {
    // Legend text color
    this.chartOptions.plugins.legend.labels.color = isDark ? '#f9fafb' : '#111827';
    
    // Tooltip text color
    this.chartOptions.plugins.tooltip.titleColor = isDark ? '#f9fafb' : '#111827';
    this.chartOptions.plugins.tooltip.bodyColor = isDark ? '#f9fafb' : '#111827';
    
    // Axis ticks color
    this.chartOptions.scales.x.ticks.color = isDark ? '#f9fafb' : '#111827';
    this.chartOptions.scales.y.ticks.color = isDark ? '#f9fafb' : '#111827';
  }
}

}
